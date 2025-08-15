require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.COCKROACHDB_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false }
});

// Your complete questions data
const questions = [
  {
    "id": "1",
    "question": "What year was 'The Exorcist' released?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq1.jpg?alt=media&token=0d2a4b50-de4a-49b1-8c05-7cdd0b7b5d33",
    "options": ["1971", "1973", "1975", "1977"],
    "correctAnswer": "1973",
    "explanation": "'The Exorcist' was released in 1973 and became a cultural phenomenon."
  },
  {
    "id": "2",
    "question": "Who directed 'The Shining'?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq2.jpg?alt=media&token=1e3b5c61-ef5b-5a2c-8d1e-8dee1c8c6e44",
    "options": ["Stanley Kubrick", "Alfred Hitchcock", "John Carpenter", "Wes Craven"],
    "correctAnswer": "Stanley Kubrick",
    "explanation": "Stanley Kubrick directed 'The Shining' in 1980."
  },
  {
    "id": "3",
    "question": "What is the name of the killer in 'Halloween'?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq3.jpg?alt=media&token=2f4c6d72-fg6c-6b3d-9e2f-9eff2d9d7f55",
    "options": ["Jason Voorhees", "Freddy Krueger", "Michael Myers", "Leatherface"],
    "correctAnswer": "Michael Myers",
    "explanation": "Michael Myers is the iconic killer in the 'Halloween' franchise."
  },
  {
    "id": "4",
    "question": "What year was the original 'Night of the Living Dead' released?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq4.jpg?alt=media&token=3g5d7e83-gh7d-7c4e-0f3g-0fgg3e0e8g66",
    "options": ["1966", "1968", "1970", "1972"],
    "correctAnswer": "1968",
    "explanation": "George A. Romero's 'Night of the Living Dead' was released in 1968."
  },
  {
    "id": "5",
    "question": "Who played Norman Bates in 'Psycho'?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq5.jpg?alt=media&token=4h6e8f94-hi8e-8d5f-1g4h-1ghh4f1f9h77",
    "options": ["Anthony Perkins", "Vincent Price", "Peter Lorre", "Boris Karloff"],
    "correctAnswer": "Anthony Perkins",
    "explanation": "Anthony Perkins played the iconic Norman Bates in Alfred Hitchcock's 'Psycho'."
  },
  {
    "id": "6",
    "question": "What is the name of the hotel in 'The Shining'?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq6.jpg?alt=media&token=5i7f9g05-ij9f-9e6g-2h5i-2hii5g2g0i88",
    "options": ["The Overlook Hotel", "The Bates Motel", "The Overlook Inn", "The Shining Hotel"],
    "correctAnswer": "The Overlook Hotel",
    "explanation": "The Overlook Hotel is the haunted hotel in 'The Shining'."
  },
  {
    "id": "7",
    "question": "Who directed 'A Nightmare on Elm Street'?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq7.jpg?alt=media&token=6j8g0h16-jk0g-0f7h-3i6j-3ijj6h3h1j99",
    "options": ["Wes Craven", "John Carpenter", "Sean S. Cunningham", "Tobe Hooper"],
    "correctAnswer": "Wes Craven",
    "explanation": "Wes Craven directed the original 'A Nightmare on Elm Street' in 1984."
  },
  {
    "id": "8",
    "question": "What is the name of the killer in 'Friday the 13th'?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq8.jpg?alt=media&token=7k9h1i27-kl1h-1g8i-4j7k-4jkk7i4i2k00",
    "options": ["Michael Myers", "Freddy Krueger", "Jason Voorhees", "Leatherface"],
    "correctAnswer": "Jason Voorhees",
    "explanation": "Jason Voorhees is the iconic killer in the 'Friday the 13th' franchise."
  },
  {
    "id": "9",
    "question": "What year was 'The Texas Chain Saw Massacre' released?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq9.jpg?alt=media&token=8l0i2j38-lm2i-2h9j-5k8l-5kll8j5j3l11",
    "options": ["1972", "1974", "1976", "1978"],
    "correctAnswer": "1974",
    "explanation": "Tobe Hooper's 'The Texas Chain Saw Massacre' was released in 1974."
  },
  {
    "id": "10",
    "question": "Who played Dracula in the 1931 Universal film?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq10.jpg?alt=media&token=9m1j3k49-mn3j-3i0k-6l9m-6lmm9k6k4m22",
    "options": ["Bela Lugosi", "Christopher Lee", "Vincent Price", "Lon Chaney Jr."],
    "correctAnswer": "Bela Lugosi",
    "explanation": "Bela Lugosi played Count Dracula in the 1931 Universal classic."
  },
  {
    "id": "11",
    "question": "What is the name of the killer in 'Scream'?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq11.jpg?alt=media&token=0n2k4l50-no4k-4j1l-7m0n-7mnn0l7l5n33",
    "options": ["Ghostface", "The Scream Killer", "The Woodsboro Killer", "The Masked Killer"],
    "correctAnswer": "Ghostface",
    "explanation": "Ghostface is the masked killer in the 'Scream' franchise."
  },
  {
    "id": "12",
    "question": "Who directed 'Halloween'?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq12.jpg?alt=media&token=1o3l5m61-op5l-5k2m-8n1o-8noo1m8m6o44",
    "options": ["John Carpenter", "Wes Craven", "Sean S. Cunningham", "Tobe Hooper"],
    "correctAnswer": "John Carpenter",
    "explanation": "John Carpenter directed the original 'Halloween' in 1978."
  },
  {
    "id": "13",
    "question": "What year was 'The Silence of the Lambs' released?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq13.jpg?alt=media&token=2p4m6n72-pq6m-6l3n-9o2p-9opp2n9n7p55",
    "options": ["1989", "1991", "1993", "1995"],
    "correctAnswer": "1991",
    "explanation": "'The Silence of the Lambs' was released in 1991 and won Best Picture."
  },
  {
    "id": "14",
    "question": "Who played Hannibal Lecter in 'The Silence of the Lambs'?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq14.jpg?alt=media&token=3q5n7o83-qr7n-7m4o-0p3q-0pqq3o0o8q66",
    "options": ["Anthony Hopkins", "Brian Cox", "Mads Mikkelsen", "Gaspard Ulliel"],
    "correctAnswer": "Anthony Hopkins",
    "explanation": "Anthony Hopkins won an Oscar for his portrayal of Hannibal Lecter."
  },
  {
    "id": "15",
    "question": "What is the name of the killer in 'Child's Play'?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq15.jpg?alt=media&token=4r6o8p94-rs8o-8n5p-1q4r-1qrr4p1p9r77",
    "options": ["Chucky", "Billy", "Annabelle", "Slappy"],
    "correctAnswer": "Chucky",
    "explanation": "Chucky is the possessed doll in the 'Child's Play' franchise."
  },
  {
    "id": "16",
    "question": "Who directed 'The Evil Dead'?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq16.jpg?alt=media&token=5s7p9q05-st9p-9o6q-2r5s-2rss5q2q0s88",
    "options": ["Sam Raimi", "Peter Jackson", "Guillermo del Toro", "Eli Roth"],
    "correctAnswer": "Sam Raimi",
    "explanation": "Sam Raimi directed the original 'The Evil Dead' in 1981."
  },
  {
    "id": "17",
    "question": "What year was 'The Thing' released?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq17.jpg?alt=media&token=6t8q0r16-tu0q-0p7r-3s6t-3stt6r3r1t99",
    "options": ["1978", "1980", "1982", "1984"],
    "correctAnswer": "1982",
    "explanation": "John Carpenter's 'The Thing' was released in 1982."
  },
  {
    "id": "18",
    "question": "Who played the title role in 'Frankenstein' (1931)?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq18.jpg?alt=media&token=7u9r1s27-uv1r-1q8s-4t7u-4tuu7s4s2u00",
    "options": ["Boris Karloff", "Lon Chaney Jr.", "Vincent Price", "Peter Lorre"],
    "correctAnswer": "Boris Karloff",
    "explanation": "Boris Karloff played the Monster in the 1931 Universal 'Frankenstein'."
  },
  {
    "id": "19",
    "question": "What is the name of the killer in 'Hellraiser'?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq19.jpg?alt=media&token=8v0s2t38-vw2s-2r9t-5u8v-5uvv8t5t3v11",
    "options": ["Pinhead", "Cenobite", "Hell Priest", "The Lament Configuration"],
    "correctAnswer": "Pinhead",
    "explanation": "Pinhead is the leader of the Cenobites in the 'Hellraiser' franchise."
  },
  {
    "id": "20",
    "question": "Who directed 'The Blair Witch Project'?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq20.jpg?alt=media&token=9w1t3u49-wx3t-3s0u-6v9w-6vww9u6u4w22",
    "options": ["Daniel Myrick & Eduardo Sánchez", "Oren Peli", "James Wan", "Eli Roth"],
    "correctAnswer": "Daniel Myrick & Eduardo Sánchez",
    "explanation": "Daniel Myrick and Eduardo Sánchez co-directed 'The Blair Witch Project'."
  },
  {
    "id": "21",
    "question": "What year was 'The Ring' released?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq21.jpg?alt=media&token=0x2u4v50-xy4u-4t1v-7w0x-7wxx0v7v5x33",
    "options": ["2000", "2002", "2004", "2006"],
    "correctAnswer": "2002",
    "explanation": "The American remake of 'The Ring' was released in 2002."
  },
  {
    "id": "22",
    "question": "Who played the title role in 'The Wolf Man' (1941)?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq22.jpg?alt=media&token=1y3v5w61-yz5v-5u2w-8x1y-8xyy1w8w6y44",
    "options": ["Lon Chaney Jr.", "Boris Karloff", "Vincent Price", "Peter Lorre"],
    "correctAnswer": "Lon Chaney Jr.",
    "explanation": "Lon Chaney Jr. played Larry Talbot/The Wolf Man in the 1941 Universal film."
  },
  {
    "id": "23",
    "question": "What is the name of the killer in 'Saw'?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq23.jpg?alt=media&token=2z4w6x72-za6w-6v3x-9y2z-9yzz2x9x7z55",
    "options": ["Jigsaw", "The Puppet", "Billy", "The Killer"],
    "correctAnswer": "Jigsaw",
    "explanation": "Jigsaw is the mastermind killer in the 'Saw' franchise."
  },
  {
    "id": "24",
    "question": "Who directed 'Saw'?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq24.jpg?alt=media&token=3a5x7y83-ab7x-7w4y-0z3a-0zaa3y0y8a66",
    "options": ["James Wan", "Leigh Whannell", "Darren Lynn Bousman", "Kevin Greutert"],
    "correctAnswer": "James Wan",
    "explanation": "James Wan directed the original 'Saw' in 2004."
  },
  {
    "id": "25",
    "question": "What year was 'The Conjuring' released?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq25.jpg?alt=media&token=4b6y8z94-bc8y-8x5z-1a4b-1abb4z1z9b77",
    "options": ["2011", "2013", "2015", "2017"],
    "correctAnswer": "2013",
    "explanation": "'The Conjuring' was released in 2013 and launched a successful franchise."
  },
  {
    "id": "26",
    "question": "Who played the title role in 'The Mummy' (1932)?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq26.jpg?alt=media&token=5c7z9a05-cd9z-9y6a-2b5c-2bcc5a2a0c88",
    "options": ["Boris Karloff", "Lon Chaney Jr.", "Vincent Price", "Peter Lorre"],
    "correctAnswer": "Boris Karloff",
    "explanation": "Boris Karloff played Imhotep in the 1932 Universal 'The Mummy'."
  },
  {
    "id": "27",
    "question": "What is the name of the killer in 'The Purge'?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq27.jpg?alt=media&token=6d8a0b16-de0a-0z7b-3c6d-3cdd6b3b1d99",
    "options": ["The Purge Killers", "The Founding Fathers", "The New Founding Fathers", "The Purge Participants"],
    "correctAnswer": "The New Founding Fathers",
    "explanation": "The New Founding Fathers are the organization behind The Purge."
  },
  {
    "id": "28",
    "question": "Who directed 'The Purge'?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq28.jpg?alt=media&token=7e9b1c27-ef1b-1a8c-4d7e-4dee7c4c2e00",
    "options": ["James DeMonaco", "Leigh Whannell", "James Wan", "Eli Roth"],
    "correctAnswer": "James DeMonaco",
    "explanation": "James DeMonaco directed the original 'The Purge' in 2013."
  },
  {
    "id": "29",
    "question": "What year was 'Get Out' released?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq29.jpg?alt=media&token=8f0c2d38-fg2c-2b9d-5e8f-5eff8d5d3f11",
    "options": ["2015", "2017", "2019", "2021"],
    "correctAnswer": "2017",
    "explanation": "Jordan Peele's 'Get Out' was released in 2017 and won Best Original Screenplay."
  },
  {
    "id": "30",
    "question": "Who directed 'Get Out'?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq30.jpg?alt=media&token=9g1d3e49-gh3d-3c0e-6f9g-6fgg9e6e4g22",
    "options": ["Jordan Peele", "Ari Aster", "Robert Eggers", "M. Night Shyamalan"],
    "correctAnswer": "Jordan Peele",
    "explanation": "Jordan Peele made his directorial debut with 'Get Out'."
  },
  {
    "id": "31",
    "question": "What is the name of the killer in 'It Follows'?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq31.jpg?alt=media&token=0h2e4f50-hi4e-4d1f-7g0h-7ghh0f7f5h33",
    "options": ["The Follower", "It", "The Entity", "The Curse"],
    "correctAnswer": "It",
    "explanation": "The supernatural entity in 'It Follows' is simply called 'It'."
  },
  {
    "id": "32",
    "question": "Who directed 'It Follows'?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq32.jpg?alt=media&token=1i3f5g61-ij5f-5e2g-8h1i-8hii1g8g6i44",
    "options": ["David Robert Mitchell", "Ari Aster", "Robert Eggers", "Jordan Peele"],
    "correctAnswer": "David Robert Mitchell",
    "explanation": "David Robert Mitchell directed 'It Follows' in 2014."
  },
  {
    "id": "33",
    "question": "What year was 'Hereditary' released?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq33.jpg?alt=media&token=2j4g6h72-jk6g-6f3h-9i2j-9ijj2h9h7j55",
    "options": ["2016", "2018", "2020", "2022"],
    "correctAnswer": "2018",
    "explanation": "Ari Aster's 'Hereditary' was released in 2018."
  },
  {
    "id": "34",
    "question": "Who directed 'Hereditary'?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq34.jpg?alt=media&token=3k5h7i83-kl7h-7g4i-0j3k-0jkk3i0i8k66",
    "options": ["Ari Aster", "Robert Eggers", "Jordan Peele", "M. Night Shyamalan"],
    "correctAnswer": "Ari Aster",
    "explanation": "Ari Aster made his feature film debut with 'Hereditary'."
  },
  {
    "id": "35",
    "question": "What is the name of the killer in 'The Babadook'?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq35.jpg?alt=media&token=4l6i8j94-lm8i-8h5j-1k4l-1kll4j1j9l77",
    "options": ["The Babadook", "The Monster", "The Book", "The Creature"],
    "correctAnswer": "The Babadook",
    "explanation": "The Babadook is the titular monster from the children's book in the film."
  },
  {
    "id": "36",
    "question": "Who directed 'The Babadook'?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq36.jpg?alt=media&token=5m7j9k05-mn9j-9i6k-2l5m-2lmm5k2k0m88",
    "options": ["Jennifer Kent", "Julia Ducournau", "Coralie Fargeat", "Rose Glass"],
    "correctAnswer": "Jennifer Kent",
    "explanation": "Jennifer Kent directed 'The Babadook' in 2014."
  },
  {
    "id": "37",
    "question": "What year was 'The Witch' released?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq37.jpg?alt=media&token=6n8k0l16-no0k-0j7l-3m6n-3mnn6l3l1n99",
    "options": ["2014", "2016", "2018", "2020"],
    "correctAnswer": "2016",
    "explanation": "Robert Eggers' 'The Witch' was released in 2016."
  },
  {
    "id": "38",
    "question": "Who directed 'The Witch'?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq38.jpg?alt=media&token=7o9l1m27-op1l-1k8m-4n7o-4noo7m4m2o00",
    "options": ["Robert Eggers", "Ari Aster", "Jordan Peele", "M. Night Shyamalan"],
    "correctAnswer": "Robert Eggers",
    "explanation": "Robert Eggers made his feature film debut with 'The Witch'."
  },
  {
    "id": "39",
    "question": "What is the name of the killer in 'Midsommar'?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq39.jpg?alt=media&token=8p0m2n38-pq2m-2l9n-5o8p-5opp8n5n3p11",
    "options": ["The Hårga", "The Cult", "The May Queen", "The Village"],
    "correctAnswer": "The Hårga",
    "explanation": "The Hårga is the Swedish pagan cult in 'Midsommar'."
  },
  {
    "id": "40",
    "question": "Who directed 'Midsommar'?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq40.jpg?alt=media&token=9q1n3o49-qr3n-3m0o-6p9q-6pqq9o6o4q22",
    "options": ["Ari Aster", "Robert Eggers", "Jordan Peele", "M. Night Shyamalan"],
    "correctAnswer": "Ari Aster",
    "explanation": "Ari Aster directed 'Midsommar' in 2019."
  },
  {
    "id": "41",
    "question": "What year was 'The Lighthouse' released?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq41.jpg?alt=media&token=0r2o4p50-rs4o-4n1p-7q0r-7qrr0p7p5r33",
    "options": ["2017", "2019", "2021", "2023"],
    "correctAnswer": "2019",
    "explanation": "Robert Eggers' 'The Lighthouse' was released in 2019."
  },
  {
    "id": "42",
    "question": "Who directed 'The Lighthouse'?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq42.jpg?alt=media&token=1s3p5q61-st5p-5o2q-8r1s-8rss1q8q6s44",
    "options": ["Robert Eggers", "Ari Aster", "Jordan Peele", "M. Night Shyamalan"],
    "correctAnswer": "Robert Eggers",
    "explanation": "Robert Eggers directed 'The Lighthouse' starring Willem Dafoe and Robert Pattinson."
  },
  {
    "id": "43",
    "question": "What is the name of the killer in 'Us'?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq43.jpg?alt=media&token=2t4q6r72-tu6q-6p3r-9s2t-9stt2r9r7t55",
    "options": ["The Tethered", "The Doppelgängers", "The Shadows", "The Others"],
    "correctAnswer": "The Tethered",
    "explanation": "The Tethered are the underground doppelgängers in Jordan Peele's 'Us'."
  },
  {
    "id": "44",
    "question": "Who directed 'Us'?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq44.jpg?alt=media&token=3u5r7s83-uv7r-7q4s-0t3u-0tuu3s0s8u66",
    "options": ["Jordan Peele", "Ari Aster", "Robert Eggers", "M. Night Shyamalan"],
    "correctAnswer": "Jordan Peele",
    "explanation": "Jordan Peele directed 'Us' in 2019, his second horror film after 'Get Out'."
  },
  {
    "id": "45",
    "question": "What year was 'The Invisible Man' (2020) released?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq45.jpg?alt=media&token=4v6s8t94-vw8s-8r5t-1u4v-1uvv4t1t9v77",
    "options": ["2018", "2020", "2022", "2024"],
    "correctAnswer": "2020",
    "explanation": "Leigh Whannell's 'The Invisible Man' was released in 2020."
  },
  {
    "id": "46",
    "question": "Who directed 'The Invisible Man' (2020)?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq46.jpg?alt=media&token=5w7t9u05-wx9t-9s6u-2v5w-2vww5u2u0w88",
    "options": ["Leigh Whannell", "James Wan", "Blumhouse Productions", "Universal Pictures"],
    "correctAnswer": "Leigh Whannell",
    "explanation": "Leigh Whannell directed the 2020 remake of 'The Invisible Man'."
  },
  {
    "id": "47",
    "question": "What is the name of the killer in 'Candyman' (2021)?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq47.jpg?alt=media&token=6x8u0v16-xy0u-0t7v-3w6x-3wxx6v3v1x99",
    "options": ["Candyman", "Daniel Robitaille", "The Hook", "The Urban Legend"],
    "correctAnswer": "Candyman",
    "explanation": "Candyman is the vengeful spirit in the urban legend and film series."
  },
  {
    "id": "48",
    "question": "Who directed 'Candyman' (2021)?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq48.jpg?alt=media&token=7y9v1w27-yz1v-1u8w-4x7y-4xyy7w4w2y00",
    "options": ["Nia DaCosta", "Jordan Peele", "Bernard Rose", "Clive Barker"],
    "correctAnswer": "Nia DaCosta",
    "explanation": "Nia DaCosta directed the 2021 'Candyman' sequel/reboot."
  },
  {
    "id": "49",
    "question": "What year was 'Malignant' released?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq49.jpg?alt=media&token=8z0w2x38-za2w-2v9x-5y8z-5yzz8x5x3z11",
    "options": ["2019", "2021", "2023", "2025"],
    "correctAnswer": "2021",
    "explanation": "James Wan's 'Malignant' was released in 2021."
  },
  {
    "id": "50",
    "question": "Who directed 'Malignant'?",
    "image": "https://firebasestorage.googleapis.com/v0/b/horrorhub.appspot.com/o/public%2Ftrivia-images%2Fq50.jpg?alt=media&token=9a1x3y49-ab3x-3w0y-6z9a-6zaa9y6y4a22",
    "options": ["James Wan", "Leigh Whannell", "Darren Lynn Bousman", "Kevin Greutert"],
    "correctAnswer": "James Wan",
    "explanation": "James Wan returned to horror with 'Malignant' in 2021."
  }
];

async function importQuestions() {
  try {
    console.log('Starting question import...');

    for (const question of questions) {
      const sql = `
        INSERT INTO trivia_questions
        (id, question, image_url, options, correct_answer, explanation, category, difficulty, is_approved)
        VALUES ($1, $2, $3, $4, $5, $6, $7, ($8)::integer, $9)
        ON CONFLICT (id) DO NOTHING
        RETURNING id
      `;

      const params = [
        parseInt(question.id),
        question.question,
        question.image,
        JSON.stringify(question.options),
        question.correctAnswer,
        question.explanation,
        'horror',
        1,
        true
      ];

      const result = await pool.query(sql, params);
      if (result.rows.length > 0) {
        console.log(`Imported question ${question.id}: ${question.question.substring(0, 50)}...`);
      } else {
        console.log(`Question ${question.id} already exists, skipped`);
      }
    }

    console.log('Question import complete!');

    // Check total count
    const countResult = await pool.query('SELECT COUNT(*) FROM trivia_questions WHERE is_approved = true');
    console.log(`Total approved questions in database: ${countResult.rows[0].count}`);

  } catch (error) {
    console.error('Import error:', error);
  } finally {
    await pool.end();
  }
}

importQuestions();
