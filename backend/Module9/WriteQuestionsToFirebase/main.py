# Remove these lines from the Cloud Function code
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase Admin SDK (You can use your service account key here)
cred = credentials.Certificate('serviceAccountKey.json')
firebase_admin.initialize_app(cred)

def write_questions_to_firestore(request):
    # Your sample questions list goes here
    sample_questions = sample_questions = [
    {'question': 'What are the key steps involved in the process of photosynthesis, and how does it help plants produce their own food and release oxygen into the atmosphere?'},
    {'question': 'Explain the stages of cell division and the significance of mitosis in the growth and repair of multicellular organisms, with examples from different species.'},
    {'question': 'Describe the structure of an atom, including its subatomic particles such as protons, neutrons, and electrons, and how they contribute to the atom\'s properties.'},
    {'question': 'Discuss the principles of heredity and the laws of inheritance proposed by Gregor Mendel in his experiments with pea plants, and explain how genetic traits are passed down through generations.'},
    {'question': 'What are the major theories of evolution, such as natural selection and genetic drift, and how do they explain the diversity of life on Earth, with evidence from the fossil record and comparative anatomy?'},

    {'question': 'Explain the rules and tactics of soccer, including the roles of different positions on the field, and analyze strategies used by teams in various competitions.'},
    {'question': 'What are the different strokes used in swimming, such as freestyle, backstroke, breaststroke, and butterfly, and how do swimmers improve their technique and efficiency?'},
    {'question': 'Discuss the history and evolution of basketball, including its origins, key figures, and how the sport has become a global phenomenon.'},
    {'question': 'Describe the equipment and techniques used in rock climbing, including types of climbing holds, safety gear, and the physical and mental challenges climbers face during ascents.'},
    {'question': 'What are the various styles of martial arts, such as karate, taekwondo, judo, and kung fu, and how do they differ in philosophy, techniques, and origins?'},

    {'question': 'Explain the causes and consequences of the American Civil War, including social, economic, and political factors that led to the conflict, and its impact on the nation and the abolition of slavery.'},
    {'question': 'Describe the rise and fall of the Roman Empire, including its expansion, governance, and cultural contributions, as well as the internal and external factors that led to its decline.'},
    {'question': 'What were the major events and outcomes of the French Revolution, and how did it shape modern France and influence political ideologies worldwide?'},
    {'question': 'Discuss the achievements and legacy of ancient Egyptian civilization, including its art, architecture, religion, and cultural practices, such as mummification and pyramid construction.'},
    {'question': 'Examine the significance and consequences of the Industrial Revolution on society, economy, and technological advancements, with a focus on the transition from agrarian to industrial economies.'},

    {'question': 'Analyze the themes and symbolism in a classic novel such as "To Kill a Mockingbird" or "1984," exploring how the authors use literary devices to convey powerful messages about society and human nature.'},
    {'question': 'Discuss the influence of iconic filmmakers like Alfred Hitchcock or Steven Spielberg on the art of cinema, examining their signature styles, recurring themes, and impact on the film industry.'},
    {'question': 'Examine the evolution of video gaming, from early arcade games to modern virtual reality experiences, and analyze how technology has revolutionized interactive entertainment.'},
    {'question': 'What are the key elements of a successful Broadway musical, including storytelling, music, choreography, and design, and how do they collectively create a captivating theatrical experience for audiences?'},
    {'question': 'Analyze the impact of streaming services on the television industry and traditional cable networks, considering the changes in viewer behavior and the production and distribution of content.'},

    {'question': 'Describe the geological features and natural wonders of the Grand Canyon in Arizona, USA, and how the Colorado River has shaped the landscape over millions of years.'},
    {'question': 'What are the major climate zones of the world, such as tropical, temperate, and polar, and how do they influence the distribution of ecosystems and biodiversity?'},
    {'question': 'Discuss the cultural significance and historical landmarks of the city of Paris, France, including iconic structures like the Eiffel Tower, Notre-Dame Cathedral, and the Louvre Museum.'},
    {'question': 'Explain the process of plate tectonics and its role in the formation of mountains, earthquakes, and other geological phenomena, with examples from different regions.'},
    {'question': 'Describe the unique flora and fauna of the Amazon rainforest and its importance for global biodiversity and ecological balance, as well as the threats it faces from deforestation and climate change.'},

    {'question': 'Discuss the ethical implications of artificial intelligence and its potential impact on the job market, privacy, and human decision-making, and explore ways to ensure responsible AI development.'},
    {'question': 'What are the major programming languages used in web development, such as JavaScript, Python, and Ruby, and how do they differ in functionality and application?'},
    {'question': 'Explain the principles of cryptography and its applications in ensuring data security and privacy, including encryption methods and cryptographic protocols used in digital communication.'},
    {'question': 'Describe the history of space exploration, including key missions by space agencies like NASA, and the technological advancements that have allowed humans to explore the cosmos.'},
    {'question': 'What are the current trends in renewable energy, such as solar, wind, and hydropower, and how are they contributing to sustainable energy sources and reducing carbon emissions?'},

    {'question': 'What are the fundamental principles of democracy, such as rule of law, separation of powers, and protection of individual rights, and how do they shape government policies and decision-making?'},
    {'question': 'Describe the major components of the human digestive system and the process of nutrient absorption, including the roles of organs like the stomach, small intestine, and colon.'},
    {'question': 'Discuss the cultural significance and historical landmarks of the city of Rome, Italy, including iconic sites like the Colosseum, Roman Forum, and Vatican City.'},
    {'question': 'What are the fundamental laws of physics, such as Newton\'s laws of motion and the laws of thermodynamics, and how do they govern the behavior of the universe?'},
    {'question': 'Explain the structure of the United Nations and its role in promoting international cooperation, peacekeeping, humanitarian efforts, and the resolution of global challenges.'},

    {'question': 'Describe the traditional dishes and culinary customs of Japanese cuisine, such as sushi, tempura, and ramen, and how regional variations add diversity to Japanese food culture.'},
    {'question': 'What are the health benefits of a Mediterranean diet, which emphasizes fruits, vegetables, olive oil, and fish, and how has it been associated with longevity and overall well-being?'},
    {'question': 'Discuss the process of wine-making, from grape harvesting and fermentation to aging in different types of barrels, and the factors that influence the taste and quality of wine.'},
    {'question': 'Explain the key ingredients and preparation methods of classic French pastries like croissants and macarons, and the art of patisserie in French culinary tradition.'},
    {'question': 'What are the cultural origins and regional variations of popular coffee beverages like espresso, cappuccino, and café au lait, and their significance in coffee-loving societies?'},

    {'question': 'Analyze the themes and symbolism in a classic novel such as "To Kill a Mockingbird" or "1984," exploring how the authors use literary devices to convey powerful messages about society and human nature.'},
    {'question': 'Explore the use of allegory and imagery in a famous poem like "The Waste Land" or "The Raven," and how poets employ language to evoke emotions and deeper meanings.'},
    {'question': 'Discuss the characteristics of a tragic hero in literary works, using examples from plays like "Hamlet" or "Macbeth," and how their flaws lead to their downfall.'},
    {'question': 'Analyze the cultural and historical context of a classic work of literature like "Pride and Prejudice" or "The Great Gatsby," and the enduring relevance of the themes they explore.'},
    {'question': 'Describe the narrative structure and character development in a well-known novel such as "One Hundred Years of Solitude" or "The Catcher in the Rye," and the impact of the author\'s storytelling choices.'},

    {'question': 'Discuss the influence of classical music composers like Beethoven, Mozart, and Bach on the development of music genres, and the enduring popularity of their compositions.'},
    {'question': 'Analyze the social and political messages in protest songs from different eras, such as Bob Dylan\'s "Blowin\' in the Wind" or Marvin Gaye\'s "What\'s Going On?"'},
    {'question': 'What are the major elements of jazz improvisation, and how do musicians express their creativity in performances through techniques like syncopation and call-and-response?'},
    {'question': 'Explain the evolution of hip-hop as a cultural movement and its impact on contemporary music and art, including its role in expressing social issues and promoting empowerment.'},
    {'question': 'Describe the characteristics of different music genres, from classical symphonies and jazz improvisation to rock anthems and electronic dance music, and how they appeal to diverse audiences.'},
]



    # Get a reference to the 'questions' collection
    questions_collection = firestore.client().collection('Questions')

    # Iterate through the sample_questions list and add each question to the collection
    for question_data in sample_questions:
        questions_collection.add(question_data)

    return 'Questions added to Firestore collection!'
