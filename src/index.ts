import fastify from 'fastify';
import proxy from '@fastify/http-proxy';
import zlib from 'zlib';
import { IncomingMessage } from 'http';
import script from './script';

const server = fastify();
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

server.register(import('@fastify/compress'), { global: false });

function changeBody(request: any, reply: any, res: any, callback: any) {
	let headers = reply.getHeaders();
	let contenttype = headers['content-type'] as string;
	let contentencoding = headers['content-encoding'];

	if (contenttype?.includes('text')) {
		let decompress;

		switch (contentencoding) {
			case 'gzip':
				decompress = zlib.createGunzip();
				break;
			case 'br':
				decompress = zlib.createBrotliDecompress();
				break;
			case 'deflate':
				decompress = zlib.createInflate();
				break;
			default:
				break;
		}

		if (decompress) {
			res.pipe(decompress);
			let buffer = Buffer.from('', 'utf8');

			decompress.on(
				'data',
				(chunk) => (buffer = Buffer.concat([buffer, chunk]))
			);

			decompress.on('end', async () => {
				let body = buffer.toString();
				if (body) {
					reply.removeHeader('content-length');
					//@ts-ignore
					body = callback.call(this, body);
				}
				console.log({ body });
				reply.compress(body);
			});
		} else reply.send(res);
	} else reply.send(res);
}

const decodeHost = (input: string): string => {
	// const host = input.split('.')[0].replace(/--/g, '@@@@@@');
	// const parts = host.split('-');
	// parts.pop();
	// const actualHost = parts.join('.').replace(/@@@@@@/g, '-');
	const actualHost = 'or-lev-cohen.com';
	return actualHost;
};

server.register(proxy, {
	upstream: '',
	preHandler: async (req, res) => {
		console.log({ host: req.url });
		//@ts-ignore
		req.headers.wow = 'https://' + decodeHost(req.headers.host as string);
	},
	replyOptions: {
		getUpstream: (req: any | IncomingMessage, _base: string) => {
			const url = req.headers.wow;
			console.log({ url });
			return url;
		},
		onResponse: (request, reply, res) => {
			const host = request.headers.wow as string;
			changeBody(request, reply, res, (body: string) => {
				return (
					body.replace(
						new RegExp('https://' + host, 'g'),
						`http://localhost:8080`
					) +
					script.replace(
						'SCRIPT_URL',
						'http://127.0.0.1:5001/mopix-d18fb/us-central1/createAnimationScript?userId=xahaDymlgpfHQVpL8FMiF2m5RUo1&projectId=wieZGNTgyt7Ohwh8wW18'
					)
				);
			});
		},
	},
	disableCache: true,
	cacheURLs: 0,
});

server.listen(8080, '0.0.0.0', (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
});
