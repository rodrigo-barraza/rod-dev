import FetchWrapper from '@/wrappers/FetchWrapper';
import ApiConstants from '@/constants/ApiConstants';

const S = ApiConstants.FAVORITE_SERVICE;

const FavoriteApiLibrary = {
    async postFavorite(renderId?: string) {
        const body: Record<string, string> = {};
        if (renderId) body.renderId = renderId;
        return FetchWrapper.post(S, 'favorite', body);
    },

    async deleteFavorite(renderId?: string) {
        const body: Record<string, string> = {};
        if (renderId) body.renderId = renderId;
        return FetchWrapper.del(S, 'favorite', body);
    },
};

export default FavoriteApiLibrary;
