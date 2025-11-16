use('DOCTOR-APPOINTMENT-WEBSITE')
db.doctors.find({})


db.doctors.insertMany([
  {
  name: "Dr. Rohit Verma",
    email: "rohit.verma@neuroclinic.com",
    password: "$2b$10$QDEsN7GGSl96.2CTsGGe7OBI6p5cHlT5K0W0rOBaVnrjZTqPBt6Tq",
    phone: "9800012345",
    gender: "male",
    experience: "9 years",
    speciality: "Neurologist",
    fees: 700,
    available: true,
    address: {
      clinic: "NeuroCare Centre",
      city: "Delhi",
      state: "Delhi"
    },
    image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e"
  },
  {
    name: "Dr. Priya Sharma",
    email: "priya.sharma@gynocare.com",
    password: "$2b$10$dummypasswordhashabc12345",
    phone: "9821023456",
    gender: "female",
    experience: "11 years",
    speciality: "Gynecologist",
    fees: 600,
    available: true,
    address: {
      clinic: "GynoCare Clinic",
      city: "Mumbai",
      state: "Maharashtra"
    },
    image: "https://images.unsplash.com/photo-1588776814546-ec7fd6d16a38"
  },
  {
    name: "Dr. Arjun Mehta",
    email: "arjun.mehta@generalhealth.com",
    password: "$2b$10$dummypassxyz0987",
    phone: "9876543210",
    gender: "male",
    experience: "7 years",
    speciality: "General physician",
    fees: 400,
    available: true,
    address: {
      clinic: "City Health Center",
      city: "Bengaluru",
      state: "Karnataka"
    },
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e85"
  },
  {
    name: "Dr. Neha Kapoor",
    email: "neha.kapoor@skincare.in",
    password: "$2b$10$hash123dummy1",
    phone: "9911122233",
    gender: "female",
    experience: "6 years",
    speciality: "Dermatologist",
    fees: 550,
    available: true,
    address: {
      clinic: "SkinGlow Clinic",
      city: "Chandigarh",
      state: "Punjab"
    },
    image: "https://images.unsplash.com/photo-1612349312040-51e9d7cf2763"
  },
  {
    name: "Dr. Rishi Malhotra",
    email: "rishi.malhotra@childcare.com",
    password: "$2b$10$childhash12345",
    phone: "9808765432",
    gender: "male",
    experience: "10 years",
    speciality: "Pediatricians",
    fees: 500,
    available: true,
    address: {
      clinic: "TinySteps Clinic",
      city: "Hyderabad",
      state: "Telangana"
    },
    image: "https://images.unsplash.com/photo-1607672672467-e38c2f5ca42f"
  },
  {
    name: "Dr. Ananya Desai",
    email: "ananya.desai@digestivehealth.com",
    password: "$2b$10$digestivehash123",
    phone: "9922334455",
    gender: "female",
    experience: "8 years",
    speciality: "Gastroenterologist",
    fees: 650,
    available: true,
    address: {
      clinic: "Gut Health Clinic",
      city: "Ahmedabad",
      state: "Gujarat"
    },
    image: "https://images.unsplash.com/photo-1580281657529-47d53d0c2fa5"
  },
  {
    name: "Dr. Karan Patel",
    email: "karan.patel@medicohealth.com",
    password: "$2b$10$generalhashabc",
    phone: "9833445566",
    gender: "male",
    experience: "5 years",
    speciality: "General physician",
    fees: 350,
    available: true,
    address: {
      clinic: "MediPoint",
      city: "Pune",
      state: "Maharashtra"
    },
    image: "https://images.unsplash.com/photo-1624222734182-4c0e0dc49dc2"
  },
  {
    name: "Dr. Meera Joshi",
    email: "meera.joshi@gynowell.in",
    password: "$2b$10$gynoh12345678",
    phone: "9888877665",
    gender: "female",
    experience: "9 years",
    speciality: "Gynecologist",
    fees: 620,
    available: true,
    address: {
      clinic: "Women's Wellness Clinic",
      city: "Jaipur",
      state: "Rajasthan"
    },
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90"
  },
  {
    name: "Dr. Vivek Sinha",
    email: "vivek.sinha@skindoctor.in",
    password: "$2b$10$dermah123hash",
    phone: "9776655443",
    gender: "male",
    experience: "4 years",
    speciality: "Dermatologist",
    fees: 500,
    available: true,
    address: {
      clinic: "DermaCure Center",
      city: "Kolkata",
      state: "West Bengal"
    },
    image: "https://images.unsplash.com/photo-1579684453423-cb724127a98e"
  },
  {
    name: "Dr. Sneha Iyer",
    email: "sneha.iyer@pediacare.com",
    password: "$2b$10$pedia1234hash",
    phone: "9877898765",
    gender: "female",
    experience: "6 years",
    speciality: "Pediatricians",
    fees: 520,
    available: true,
    address: {
      clinic: "PediaCare",
      city: "Bhopal",
      state: "Madhya Pradesh"
    },
    image: "https://images.unsplash.com/photo-1588776814269-769b8be4f3db"
  }
]);
