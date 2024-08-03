/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        apiKey: "",
        authDomain: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: "",
        measurementId: "",
        NEXT_PUBLIC_openaiApiKey: "",
      },
    images: {
        remotePatterns: [
            {
              protocol: 'https',
              hostname: 'iili.io',
              port: '',
            },
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
                port: '',
            },
        ],
    },
};

export default nextConfig;
