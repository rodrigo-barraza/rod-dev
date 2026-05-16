import type { Social } from '@/types/types';

const SocialsCollection: (Social & { username: string })[] = [
    {
        type: 'github',
        name: 'Github',
        username: 'rodrigo-barraza',
        url: 'https://github.com/rodrigo-barraza'
    },
    {
        type: 'instagram',
        name: 'Instagram',
        username: 'rodrigo.dreams',
        url: 'https://www.instagram.com/rawdreygo'
    },
    {
        type: 'linkedin',
        name: 'LinkedIn',
        username: 'rodrigobarraza',
        url: 'https://www.linkedin.com/in/rodrigobarraza'
    },
    // {
    //     type: 'foundationapp',
    //     name: 'Foundation',
    //     username: '@rodrigobarraza',
    //     url: 'https://foundation.app/@rodrigobarraza'
    // },
    // {
    //     type: 'superrare',
    //     name: 'SuperRare',
    //     username: 'rodrigobarraza',
    //     url: 'https://superrare.com/rodrigobarraza'
    // },
    // {
    //     type: 'opensea',
    //     name: 'OpenSea',
    //     username: 'rodrigobarraza',
    //     url: 'https://opensea.io/rodrigobarraza'
    // },
    {
        type: 'deviantart',
        name: 'DeviantArt',
        username: 'bioviral',
        url: 'https://www.deviantart.com/bioviral'
    },
    {
        type: 'facebook',
        name: 'Facebook',
        username: 'barraza.rodrigo',
        url: 'https://www.facebook.com/barraza.rodrigo'
    },
    {
        type: 'flickr',
        name: 'Flickr',
        username: 'rodrigobarraza',
        url: 'https://flickr.com/photos/rodrigobarraza'
    },
    // {
    //     type: 'discord',
    //     name: 'Discord',
    //     username: 'virus#1337',
    // },
    {
        type: 'keybase',
        name: 'Keybase',
        username: 'rodrigobarraza',
        url: 'https://keybase.io/rodrigobarraza'
    },
    {
        type: 'behance',
        name: 'Behance',
        username: 'rodrigobarraza',
        url: 'https://www.behance.net/rodrigobarraza'
    },
];

export default SocialsCollection;
  