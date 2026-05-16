import type { SelectOption } from '@/types/types';

const StyleCollection: SelectOption[] = [
    { value: '', label: 'None', color: 'red' },
    { value: 'photograph', label: 'Photograph', color: '#30bb65' },
    { value: 'vector', label: 'Vector', color: '#5730bb' },
    { value: 'charcoal', label: 'Charcoal', color: '#474747' },
    { value: 'watercolor', label: 'Watercolor', color: '#ac37f8' },
    { value: '3d-render', label: '3D Render', color: '#2ab54a' },
    { value: 'warcraft', label: 'Fantasy', color: '#ce0909' },
    { value: 'lego', label: 'Toys', color: '#10c2a1' },
    { value: 'funko-pop', label: 'Dolls', color: '#8c889e' },
    { value: 'plastic', label: 'Plastic Wrap', color: '#a598de' },
    { value: 'renaissance', label: 'Renaissance', color: '#8c6f11' },
    { value: 'pixel', label: 'Pixel Art', color: '#c944d0' },
    { value: 'oil', label: 'Oil Painting', color: '#86a740' },
    { value: 'ceramic', label: 'Ceramics', color: '#b6a77d' }, // ceramic sculpture statue
    { value: 'rust', label: 'Rust', color: '#de4d07' }, // corroded rusted metal oxidized
    { value: 'undead', label: 'Undead', color: '#a807de' }, // undead zombie
    { value: 'vampiric', label: 'Vampiric', color: '#ff0000' }, // a vampire dracula, with blood red water on fangs
    { value: 'vaporwave', label: 'Vaporwave', color: '#9a00ff' }, // neo noir, vaporwave
    { value: 'fire', label: 'Fire', color: '#da2801' }, // made out of fire
    { value: 'water', label: 'Water', color: '#466dfa' }, // made out of water, drops, underwater
    { value: 'floral', label: 'Floral', color: '#ff249c' }, // surrounded in flowers, floral portrait, a close-up photograph
];

export default StyleCollection;
  