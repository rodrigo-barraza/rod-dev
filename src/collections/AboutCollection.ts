import type { AboutSection } from '@/types/types';

const AboutCollection: AboutSection[] = [
    {
      name: 'institutions',
      collections: [
        {
          name: 'Bachelor of Fine Arts in Photography',
          year: '2011',
          venue: 'Emily Carr University of Art + Design',
          location: 'Vancouver, Canada'
        },
      ]
    },
    {
      name: 'Recent Projects',
      collections: [
        {
          name: 'Pristine Diffusion',
          year: 'Ongoing',
          venue: 'Google Colab Notebook',
          url: 'https://colab.research.google.com/github/rodrigo-barraza/pristine-disco-diffusion/blob/master/rodrigos-pristine-disco-diffusion.ipynb',
        },
      ]
    },
    {
      name: 'Group Exhibitions',
      collections: [
        {
          name: 'Fotografías del Mundo',
          year: '2019',
          venue: 'Museo de Arte de Lima',
          location: 'Lima, Peru',
        },
        {
          name: 'Five Rooms Photography Exhibition',
          year: '2011',
          venue: 'The Waldorf Hotel',
          location: 'Vancouver, Canada',
        },
        {
          name: 'Graduation Degree Exhibition',
          year: '2011',
          venue: 'Emily Carr University of Art & Design',
          location: 'Vancouver, Canada',
        },
        {
          name: 'Selfish Motives and Panchromatic Desires',
          year: '2010',
          venue: 'Anti-Social Gallery',
          location: 'Vancouver, Canada',
        },
      ]
    },
    {
      name: 'cinematography',
      collections: [
        {
          name: 'Spotless',
          year: '2012',
          venue: 'director',
          location: 'short film',
          url: '/collections/spotless',
        },
        {
          name: 'Book of Kings',
          year: '2011',
          venue: 'cinematographer',
          location: 'short film',
        },
        {
          name: 'Rip Apart',
          year: '2010',
          venue: 'lighting technician',
          location: 'music video',
          url: '/collections/rip-apart',
        },
        {
          name: 'TV Date',
          year: '2010',
          venue: 'lighting technician',
          location: 'music video',
          url: '/collections/tv-date',
        },
      ]
    },
  ];

export default AboutCollection;
  