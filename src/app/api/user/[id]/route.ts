export default function handler(req : any, res :any) {


    if (req.method === 'GET') {

    }

    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}