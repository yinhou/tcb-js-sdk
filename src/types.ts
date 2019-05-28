export interface Config {
    env?: string;
    token?: string;
    timeout?: number;
    proxy?: string;
    persistence?: string;
}

export const JWT_KEY = 'tcbjwttoken';

export const BASE_URL = '//tcb-api.tencentcloudapi.com/web';
// export const BASE_URL = '//tcb-api.tencentcloudapi.com:8002/web';