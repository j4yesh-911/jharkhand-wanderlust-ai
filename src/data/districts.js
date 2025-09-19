// src/data/districts.js
// Enhanced dataset of Jharkhand districts with top places, descriptions, and images

const districts = [
  {
    id: 'ranchi',
    name: 'Ranchi',
    overview: 'Ranchi, the capital of Jharkhand, is renowned for its picturesque waterfalls, serene hilltops, and rich cultural heritage.',
    topPlaces: [
      {
        name: 'Dassam Falls',
        description: 'A stunning waterfall cascading from a height of 144 feet, offering a tranquil escape amidst lush greenery.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Dassam_Falls.jpg',
      },
      {
        name: 'Jonha Falls',
        description: 'Also known as Gautam Dhara, this waterfall is a popular picnic spot surrounded by dense forests.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Hundru_Falls.jpg',
      },
      {
        name: 'Tagore Hill',
        description: 'A serene hill offering panoramic views of the city, named after Nobel laureate Rabindranath Tagore.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Tagore_Hill_Ranchi.jpg',
      },
      {
        name: 'Patratu Valley',
        description: 'Known for its picturesque winding roads and lush green landscapes, perfect for nature lovers.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Patratu_Valley.jpg',
      },
      {
        name: 'Rock Garden',
        description: 'An artistic garden constructed from industrial waste, showcasing creative sculptures and designs.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Rock_Garden_Ranchi.jpg',
      },
    ],
  },
  {
    id: 'dhanbad',
    name: 'Dhanbad',
    overview: 'Dhanbad, known as the "Coal Capital of India," boasts scenic lakes and nearby waterfalls.',
    topPlaces: [
      {
        name: 'Topchanchi Lake',
        description: 'A serene lake ideal for boating and picnics, surrounded by lush greenery.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Topchanchi_Lake.jpg',
      },
      {
        name: 'Maithon Dam',
        description: 'A multipurpose dam offering boating facilities and picturesque views.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Maithon_Dam.jpg',
      },
      {
        name: 'Bhatinda Falls',
        description: 'A beautiful waterfall located near Dhanbad, perfect for short trips and nature walks.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Bhatinda_Falls_Dhanbad.jpg',
      },
    ],
  },
  {
    id: 'giridih',
    name: 'Giridih',
    overview: 'Giridih is famous for its Jain pilgrimage site, Parasnath Hills, and scenic waterfalls.',
    topPlaces: [
      {
        name: 'Parasnath Hills',
        description: 'A major Jain pilgrimage site, offering trekking opportunities and spiritual experiences.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Parasnath_Hill.jpg',
      },
      {
        name: 'Usri Falls',
        description: 'A scenic waterfall nestled amidst rocky terrains, ideal for nature enthusiasts.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Usri_Falls.jpg',
      },
      {
        name: 'Khandoli',
        description: 'A park with lakes and adventure options, perfect for family outings.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Khandoli_Park.jpg',
      },
    ],
  },
  {
    id: 'hazaribagh',
    name: 'Hazaribagh',
    overview: 'Hazaribagh is known for its dense forests, serene lakes, and rich wildlife.',
    topPlaces: [
      {
        name: 'Hazaribagh Lake',
        description: 'A tranquil lake offering boating facilities and scenic views.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Hazaribagh_Lake.jpg',
      },
      {
        name: 'Canary Hill',
        description: 'A hilltop offering panoramic views of the town and surrounding areas.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Canary_Hill.jpg',
      },
      {
        name: 'Hazaribagh National Park',
        description: 'A national park rich in flora and fauna, ideal for wildlife enthusiasts.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Hazaribagh_National_Park.jpg',
      },
    ],
  },
  {
    id: 'deoghar',
    name: 'Deoghar',
    overview: 'Deoghar is a major pilgrimage destination, home to the famous Baidyanath Temple.',
    topPlaces: [
      {
        name: 'Baba Baidyanath Dham',
        description: 'One of the 12 Jyotirlinga temples, attracting thousands of devotees annually.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Baidyanath_Temple_Deoghar.jpg',
      },
      {
        name: 'Trikut Parvat',
        description: 'A hill offering ropeway rides and panoramic views of the surrounding areas.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/3/37/Trikut_Hill_Deoghar.jpg',
      },
      {
        name: 'Basukinath',
        description: 'A temple town near Deoghar, known for its religious significance.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Basukinath_Temple.jpg',
      },
    ],
  },
  {
    id: 'palamu',
    name: 'Palamu',
    overview: 'Palamu is known for its forest reserves and historical forts.',
    topPlaces: [
      {
        name: 'Betla National Park',
        description: 'A tiger reserve offering rich flora and fauna, ideal for wildlife safaris.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Betla_National_Park.jpg',
      },
      {
        name: 'Betla Fort',
        description: 'A historic fort located near the national park, offering insights into the region\'s history.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Betla_Fort.jpg',
      },
    ],
  },
  {
    id: 'jamtara',
    name: 'Jamtara',
    overview: 'Jamtara is a smaller district known for its scenic dams and local parks.',
    topPlaces: [
      {
        name: 'Ladhna Dam',
        description: 'A scenic dam area offering mountain views and a peaceful environment.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Ladhna_Dam.jpg',
      },
      {
        name: 'Parwat Vihar Park',
        description: 'A local recreational park, ideal for family outings and nature walks.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Parwat_Vihar_Park.jpg',
      },
    ],
  },
];

export default districts;
