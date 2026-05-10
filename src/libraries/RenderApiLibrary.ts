import FetchWrapper from '@/wrappers/FetchWrapper';
import ApiConstants from '@/constants/ApiConstants';

const S = ApiConstants.RENDER_SERVICE;

const RenderApiLibrary = {
    async postRender(prompt: string, sampler: string, cfg: number, style: string, negativePrompt: string, aspectRatio?: string): Promise<Response | undefined> {
        const url = `${ApiConstants.RODRIGO_SERVICE}${S}/render`;
        try {
            const headers = new Headers({
                'Content-Type': 'application/json',
            });
            if (typeof window !== 'undefined') {
                headers.set('Session', sessionStorage.id);
                headers.set('Local', localStorage.id);
            }
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify({ prompt, negativePrompt, sampler, cfg, style, aspectRatio }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response;
        } catch (error) {
            console.error(error);
        }
    },

    async getRenders(limit?: string, mode?: string) {
        const params: Record<string, string> = {};
        if (limit) params.limit = limit;
        if (mode) params.mode = mode;
        return FetchWrapper.get(S, 'renders', params);
    },

    async getLikedRenders(limit?: string) {
        const params: Record<string, string> = {};
        if (limit) params.limit = limit;
        return FetchWrapper.get(S, 'likes', params);
    },

    async getRender(id?: string) {
        const params: Record<string, string> = {};
        if (id) params.id = id;
        return FetchWrapper.get(S, 'render', params);
    },

    async deleteRender(id?: string) {
        const body: Record<string, any> = {};
        if (id) body.id = id;
        return FetchWrapper.del(S, 'render', body);
    },

    async getCount() {
        return FetchWrapper.get(S, 'count');
    },

    async getStatus() {
        return FetchWrapper.get(S, 'status');
    },
};

export default RenderApiLibrary;
