// ===== MOCK DATA =====

const CURRENT_USER = {
  id: 0,
  username: 'you',
  name: 'Alex Rivera',
  avatar: 'https://i.pravatar.cc/150?img=12',
  bio: '📸 Capturing moments | 🌍 World traveler | ☕ Coffee addict',
  website: 'pixgram.app',
  followers: 1284,
  following: 312,
  posts: [],  // filled after POSTS defined
};

const USERS = [
  { id: 1, username: 'nat_explores', name: 'Natalia Moon',  avatar: 'https://i.pravatar.cc/150?img=1',  bio: '🌿 Nature & Adventure', followers: 48200, following: 312 },
  { id: 2, username: 'luca.foto',    name: 'Luca Bellini',  avatar: 'https://i.pravatar.cc/150?img=3',  bio: '📷 Street photography', followers: 22100, following: 198 },
  { id: 3, username: 'mia_creates',  name: 'Mia Chen',      avatar: 'https://i.pravatar.cc/150?img=5',  bio: '🎨 Art & Design', followers: 91000, following: 420 },
  { id: 4, username: 'yusuf_lens',   name: 'Yusuf Karim',   avatar: 'https://i.pravatar.cc/150?img=7',  bio: '🌅 Chasing sunsets', followers: 15800, following: 540 },
  { id: 5, username: 'sofia.world',  name: 'Sofia Estrada', avatar: 'https://i.pravatar.cc/150?img=9',  bio: '✈️ 52 countries & counting', followers: 130400, following: 280 },
  { id: 6, username: 'jakecooks',    name: 'Jake Morrison',  avatar: 'https://i.pravatar.cc/150?img=11', bio: '🍜 Food blogger', followers: 38700, following: 610 },
  { id: 7, username: 'riya.color',   name: 'Riya Patel',    avatar: 'https://i.pravatar.cc/150?img=13', bio: '🌈 Color is my language', followers: 27600, following: 390 },
  { id: 8, username: 'tomski',       name: 'Tom Kowalski',  avatar: 'https://i.pravatar.cc/150?img=15', bio: '🏔️ Mountain man', followers: 11200, following: 145 },
];

const POSTS = [
  {
    id: 101,
    userId: 1,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    caption: 'Lost in the mountains 🏔️ Every peak has a story to tell. #hiking #mountains #adventure',
    location: 'Swiss Alps',
    likes: 4821,
    liked: false,
    saved: false,
    tags: ['hiking', 'mountains', 'adventure'],
    comments: [
      { username: 'luca.foto', text: 'Incredible shot! 😍', time: '2h' },
      { username: 'mia_creates', text: 'This is breathtaking!', time: '1h' },
    ],
    time: '3 hours ago',
  },
  {
    id: 102,
    userId: 3,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80',
    caption: 'Morning ritual ☕ There is something sacred about that first sip. #coffee #morningvibes',
    location: 'Brooklyn, NY',
    likes: 2103,
    liked: false,
    saved: false,
    tags: ['coffee', 'morningvibes'],
    comments: [
      { username: 'jakecooks', text: 'Need this rn ☕', time: '45m' },
    ],
    time: '5 hours ago',
  },
  {
    id: 103,
    userId: 5,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80',
    caption: 'Tokyo at night hits different 🌃 Neon dreams and ramen streams. #tokyo #travel #japan',
    location: 'Shinjuku, Tokyo',
    likes: 9854,
    liked: false,
    saved: false,
    tags: ['tokyo', 'travel', 'japan'],
    comments: [
      { username: 'yusuf_lens', text: 'On my bucket list! 🇯🇵', time: '3h' },
      { username: 'riya.color', text: 'The colors are insane 😭', time: '2h' },
      { username: 'tomski', text: 'Been there, loved every second!', time: '30m' },
    ],
    time: '8 hours ago',
  },
  {
    id: 104,
    userId: 7,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80',
    caption: 'Minimal spaces, maximal peace 🤍 My new home studio setup. #interior #minimal #design',
    location: 'Copenhagen',
    likes: 6720,
    liked: false,
    saved: false,
    tags: ['interior', 'minimal', 'design'],
    comments: [
      { username: 'mia_creates', text: 'Goals 😭🤍', time: '1h' },
    ],
    time: '12 hours ago',
  },
  {
    id: 105,
    userId: 6,
    image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=600&q=80',
    caption: 'Açaí bowl heaven 🍇 Fueling creativity one bowl at a time. #foodie #acai #healthyeating',
    location: 'Los Angeles, CA',
    likes: 3312,
    liked: false,
    saved: false,
    tags: ['foodie', 'acai', 'healthyeating'],
    comments: [
      { username: 'nat_explores', text: 'Drooling right now 😋', time: '5h' },
    ],
    time: '1 day ago',
  },
  {
    id: 106,
    userId: 4,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    caption: 'Golden hour at the beach 🌅 The ocean never gets old. #sunset #beach #goldenhour',
    location: 'Malibu, CA',
    likes: 7248,
    liked: false,
    saved: false,
    tags: ['sunset', 'beach', 'goldenhour'],
    comments: [
      { username: 'sofia.world', text: 'Perfection 🌅', time: '8h' },
      { username: 'luca.foto', text: 'What camera did you use?', time: '6h' },
    ],
    time: '1 day ago',
  },
  {
    id: 107,
    userId: 2,
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&q=80',
    caption: 'City never sleeps 🌆 Found this view at 2am. Worth it. #nyc #cityscape #streetphotography',
    location: 'New York City',
    likes: 5590,
    liked: false,
    saved: false,
    tags: ['nyc', 'cityscape', 'streetphotography'],
    comments: [
      { username: 'yusuf_lens', text: '2am dedication 🙌', time: '20h' },
    ],
    time: '2 days ago',
  },
  {
    id: 108,
    userId: 8,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
    caption: 'The best view comes after the hardest climb 🧗 #mountains #hiking #nature',
    location: 'Rocky Mountains, CO',
    likes: 4100,
    liked: false,
    saved: false,
    tags: ['mountains', 'hiking', 'nature'],
    comments: [
      { username: 'nat_explores', text: 'So true!! Beautiful 😍', time: '1d' },
    ],
    time: '2 days ago',
  },
];

// Attach posts to CURRENT_USER
CURRENT_USER.posts = [
  { id: 201, image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80' },
  { id: 202, image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80' },
  { id: 203, image: 'https://images.unsplash.com/photo-1502791451862-7bd8c1df43a7?w=400&q=80' },
  { id: 204, image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80' },
  { id: 205, image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&q=80' },
  { id: 206, image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&q=80' },
];

const STORIES = [
  { id: 1, userId: 0, username: 'you',          avatar: 'https://i.pravatar.cc/80?img=12', image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80', time: 'Now', hasNew: false, isOwn: true },
  { id: 2, userId: 1, username: 'nat_explores', avatar: 'https://i.pravatar.cc/80?img=1',  image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', time: '1m ago',  hasNew: true },
  { id: 3, userId: 2, username: 'luca.foto',    avatar: 'https://i.pravatar.cc/80?img=3',  image: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=600&q=80', time: '22m ago', hasNew: true },
  { id: 4, userId: 3, username: 'mia_creates',  avatar: 'https://i.pravatar.cc/80?img=5',  image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', time: '1h ago',  hasNew: true },
  { id: 5, userId: 5, username: 'sofia.world',  avatar: 'https://i.pravatar.cc/80?img=9',  image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80', time: '2h ago',  hasNew: true },
  { id: 6, userId: 6, username: 'jakecooks',    avatar: 'https://i.pravatar.cc/80?img=11', image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=600&q=80', time: '3h ago',  hasNew: false },
  { id: 7, userId: 7, username: 'riya.color',   avatar: 'https://i.pravatar.cc/80?img=13', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80', time: '5h ago',  hasNew: false },
];

// Helper: get user by id
function getUserById(id) {
  if (id === 0) return CURRENT_USER;
  return USERS.find(u => u.id === id) || CURRENT_USER;
}

// Format large numbers
function formatCount(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

// Suggestions: random users not in following list
const SUGGESTIONS = USERS.slice(0, 5).map(u => ({ ...u, following: false }));
