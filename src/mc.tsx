import * as Minio from 'minio'

const mc = new Minio.Client(
    {
        endPoint: '192.168.0.110',
        port: 9001,
        useSSL: false,
        accessKey: 'minioadmin',
        secretKey: 'minioadmin',
    }
)

export default mc