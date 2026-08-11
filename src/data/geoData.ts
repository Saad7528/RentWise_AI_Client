export interface GeoDataStructure {
  [division: string]: {
    name: string;
    districts: {
      [district: string]: {
        name: string;
        thanas: {
          [thana: string]: {
            name: string;
            neighborhoods: string[];
          };
        };
      };
    };
  };
}

export const GEO_DATA: GeoDataStructure = {
  'Dhaka': {
    name: 'ঢাকা বিভাগ',
    districts: {
      'Dhaka': {
        name: 'ঢাকা জেলা',
        thanas: {
          'Dhanmondi': { name: 'ধানমন্ডি', neighborhoods: ['Dhanmondi R/A', 'Sobhanbagh', 'Shankar', 'Kalabagan'] },
          'Mirpur': { name: 'মিরপুর', neighborhoods: ['Mirpur 1', 'Mirpur 2', 'Mirpur 6', 'Mirpur 10', 'Mirpur 11', 'Mirpur 12', 'Mirpur 14', 'Pallabi', 'Kazipara', 'Shewrapara'] },
          'Uttara': { name: 'উত্তরা', neighborhoods: ['Sector 1', 'Sector 3', 'Sector 4', 'Sector 7', 'Sector 10', 'Sector 11', 'Sector 13', 'Uttarkhan', 'Dakshinkhan'] },
          'Gulshan': { name: 'গুলশান', neighborhoods: ['Gulshan 1', 'Gulshan 2', 'Niketan'] },
          'Banani': { name: 'বনানী', neighborhoods: ['Banani Block A', 'Banani Block C', 'Chairmanbari'] },
          'Mohakhali': { name: 'মহাখালী', neighborhoods: ['Mohakhali DOHS', 'Wireless Gate', 'TB Gate'] },
          'Badda': { name: 'বাড্ডা', neighborhoods: ['Middle Badda', 'South Badda', 'Merul Badda', 'Aftabnagar'] },
          'Rampura': { name: 'রামপুরা', neighborhoods: ['West Rampura', 'East Rampura', 'Banasree', 'Banasree Block A', 'Banasree Block B'] },
          'Khilgaon': { name: 'খিলগাঁও', neighborhoods: ['Goran', 'Tilpapara', 'Sipahibag', 'Taltola'] },
          'Mohammadpur': { name: 'মোহাম্মদপুর', neighborhoods: ['Town Hall', 'Japan Garden City', 'Kaderabad Housing', 'Ring Road', 'Iqbal Road', 'Taj Mahal Road'] },
          'Hazaribagh': { name: 'হাজারীবাগ', neighborhoods: ['Hazaribagh Tanners', 'Jigatola', 'Rayer Bazar'] },
          'Bashundhara R/A': { name: 'বসুন্ধরা আবাসিক', neighborhoods: ['Block A', 'Block B', 'Block C', 'Block D', 'Block F', 'Block I'] },
          'Lalbagh / Old Dhaka': { name: 'পুরান ঢাকা / লালবাগ', neighborhoods: ['Lalbagh', 'Chawkbazar', 'Wari', 'Sutrapur', 'Sadarghat', 'Armanitola'] },
          'Motijheel': { name: 'মতিঝিল', neighborhoods: ['Dilkusha', 'Fakirapool', 'Arambagh', 'Gopibagh'] }
        }
      },
      'Gazipur': {
        name: 'গাজীপুর জেলা',
        thanas: {
          'Gazipur Sadar': { name: 'গাজীপুর সদর', neighborhoods: ['Joydebpur', 'Chourasta', 'Boardbazar', 'Salna'] },
          'Tongi': { name: 'টঙ্গী', neighborhoods: ['Tongi Bazar', 'Station Road', 'Cherag Ali', 'College Gate'] },
          'Kaliakair': { name: 'কালিয়াকৈর', neighborhoods: ['Kaliakair Bazar', 'Mouchak', 'Chandra'] },
          'Sreepur': { name: 'শ্রীপুর', neighborhoods: ['Sreepur Sadar', 'Mawna Chowrasta'] }
        }
      },
      'Narayanganj': {
        name: 'নারায়ণগঞ্জ জেলা',
        thanas: {
          'Narayanganj Sadar': { name: 'নারায়ণগঞ্জ সদর', neighborhoods: ['Chasara', 'Tanbazar', 'Deobhog', 'Missionpara', 'Khanpur'] },
          'Fatullah': { name: 'ফতুল্লা', neighborhoods: ['Fatullah Bazar', 'Pagla', 'Shibu Market'] },
          'Siddhirganj': { name: 'সিদ্ধিরগঞ্জ', neighborhoods: ['Adamjee', 'Kanchpur', 'Signboard', 'Mizmizi'] },
          'Sonargaon': { name: 'সোনারগাঁও', neighborhoods: ['Mograpara', 'Panam Nagar', 'Kanchpur Bridge Area'] }
        }
      },
      'Tangail': {
        name: 'টাঙ্গাইল জেলা',
        thanas: {
          'Tangail Sadar': { name: 'টাঙ্গাইল সদর', neighborhoods: ['Akur Takur Para', 'Biswas Betka', 'Victoria Road', 'Old Bus Stand'] },
          'Mirzapur': { name: 'মির্জাপুর', neighborhoods: ['Mirzapur Sadar', 'Gorai', 'Kumudini Complex'] }
        }
      },
      'Narsingdi': {
        name: 'নরসিংদী জেলা',
        thanas: {
          'Narsingdi Sadar': { name: 'নরসিংদী সদর', neighborhoods: ['Velanagar', 'Madhabdi', 'Dashpara', 'Satirpara'] },
          'Palash': { name: 'পলাশ', neighborhoods: ['Palash Bazar', 'Ghorashal'] }
        }
      },
      'Manikganj': {
        name: 'মানিকগঞ্জ জেলা',
        thanas: {
          'Manikganj Sadar': { name: 'মানিকগঞ্জ সদর', neighborhoods: ['Manikganj Bazar', 'Bus Stand Area', 'Beutha', 'Kewar Jani'] },
          'Singair': { name: 'সিংগাইর', neighborhoods: ['Singair Bazar', 'Hemayetpur Road'] }
        }
      },
      'Munshiganj': {
        name: 'মুন্সীগঞ্জ জেলা',
        thanas: {
          'Munshiganj Sadar': { name: 'মুন্সীগঞ্জ সদর', neighborhoods: ['Sadar Road', 'Mirkadim', 'Kathpatti', 'Launch Ghat Area'] },
          'Sreenagar': { name: 'শ্রীনগর', neighborhoods: ['Sreenagar Bazar', 'Hashara', 'Padma Bridge Toll Plaza Area'] }
        }
      },
      'Faridpur': {
        name: 'ফরিদপুর জেলা',
        thanas: {
          'Faridpur Sadar': { name: 'ফরিদপুর সদর', neighborhoods: ['Goalchamot', 'Alipur', 'Jhiltuli', 'Mujib Sarak', 'Chawkbazar'] }
        }
      },
      'Gopalganj': {
        name: 'গোপালগঞ্জ জেলা',
        thanas: {
          'Gopalganj Sadar': { name: 'গোপালগঞ্জ সদর', neighborhoods: ['Sadar Road', 'Launch Ghat', 'Court Para', 'Bank Colony'] }
        }
      },
      'Kishoreganj': {
        name: 'কিশোরগঞ্জ জেলা',
        thanas: {
          'Kishoreganj Sadar': { name: 'কিশোরগঞ্জ সদর', neighborhoods: ['Gaital', 'Batrish', 'Puratan Thana', 'Kharampatti'] }
        }
      },
      'Madaripur': {
        name: 'মাদারীপুর জেলা',
        thanas: {
          'Madaripur Sadar': { name: 'মাদারীপুর সদর', neighborhoods: ['Main Road', 'Shakuni Lake Area', 'Eintakhola', 'Puran Bazar'] }
        }
      },
      'Rajbari': {
        name: 'রাজবাড়ী জেলা',
        thanas: {
          'Rajbari Sadar': { name: 'রাজবাড়ী সদর', neighborhoods: ['Station Road', 'Cinema Hall Mor', 'Bhabanipur', 'Sajjankanda'] }
        }
      },
      'Shariatpur': {
        name: 'শরীয়তপুর জেলা',
        thanas: {
          'Shariatpur Sadar': { name: 'শরীয়তপুর সদর', neighborhoods: ['Sadar Road', 'Palong', 'Angaria', 'Chourasta'] }
        }
      }
    }
  },
  'Chattogram': {
    name: 'চট্টগ্রাম বিভাগ',
    districts: {
      'Chattogram': {
        name: 'চট্টগ্রাম জেলা',
        thanas: {
          'Panchlaish': { name: 'পাঁচলাইশ', neighborhoods: ['GEC Circle', 'Nasirabad', 'Katalganj', 'Probortok', 'Muradpur', 'Sholoshohor'] },
          'Khulshi': { name: 'খুলশী', neighborhoods: ['South Khulshi', 'North Khulshi', 'Zakir Hossain Road', 'Jhautala'] },
          'Kotwali': { name: 'কোতোয়ালী', neighborhoods: ['Anderkilla', 'Jamal Khan', 'Chawkbazar', 'Lalkhan Bazar', 'Cheragi Pahar'] },
          'Halishahar': { name: 'হালিশহর', neighborhoods: ['Block A', 'Block B', 'Housing Estate', 'Boropol', 'Boro Pool'] },
          'Agrabad': { name: 'আগ্রাবাদ', neighborhoods: ['Commercial Area', 'CDA R/A', 'Chowmuhani', 'Badamtali'] },
          'Bakalia': { name: 'বাকলিয়া', neighborhoods: ['Syed Shah Road', 'Rahat Center', 'Kalamiah Bazar'] },
          'Patenga': { name: 'পতেঙ্গা', neighborhoods: ['Airport Road', 'Sea Beach Road', 'EPZ Area', 'Kathgor'] },
          'Hathazari': { name: 'হাটহাজারী', neighborhoods: ['Hathazari Bazar', 'CU Campus', 'Fatehabad'] }
        }
      },
      'Cox\'s Bazar': {
        name: 'কক্সবাজার জেলা',
        thanas: {
          'Cox\'s Bazar Sadar': { name: 'কক্সবাজার সদর', neighborhoods: ['Kolatoli', 'Laboni Beach Area', 'Sugandha Beach Area', 'Jhautala', 'Bazar Ghata'] },
          'Teknaf': { name: 'টেকনাফ', neighborhoods: ['Teknaf Sadar', 'Marine Drive Area'] }
        }
      },
      'Cumilla': {
        name: 'কুমিল্লা জেলা',
        thanas: {
          'Cumilla Adarsha Sadar': { name: 'কুমিল্লা আদর্শ সদর', neighborhoods: ['Kandirpar', 'Ranir Dighir Par', 'Bagichagaon', 'Shasongachha', 'Chartha', 'Tomsom Bridge'] },
          'Cumilla Sadar Dakshin': { name: 'কুমিল্লা সদর দক্ষিণ', neighborhoods: ['Paduar Bazar', 'EPZ Area', 'Kotbari'] }
        }
      },
      'Feni': {
        name: 'ফেনী জেলা',
        thanas: {
          'Feni Sadar': { name: 'ফেনী সদর', neighborhoods: ['Trunk Road', 'Shahid Shahidullah Kaiser Road', 'Rampur', 'Masterpara', 'College Road'] }
        }
      },
      'Brahmanbaria': {
        name: 'ব্রাহ্মণবাড়িয়া জেলা',
        thanas: {
          'Brahmanbaria Sadar': { name: 'ব্রাহ্মণবাড়িয়া সদর', neighborhoods: ['Medda', 'Mourail', 'Paikpara', 'Halderpara', 'Kandipara'] }
        }
      },
      'Noakhali': {
        name: 'নোয়াখালী জেলা',
        thanas: {
          'Noakhali Sadar': { name: 'নোয়াখালী সদর', neighborhoods: ['Maijdee Court', 'Sonapur', 'Harinarayanpur', 'Housing Estate', 'Supermarket Area'] }
        }
      },
      'Chandpur': {
        name: 'চাঁদপুর জেলা',
        thanas: {
          'Chandpur Sadar': { name: 'চাঁদপুর সদর', neighborhoods: ['Natun Bazar', 'Puran Bazar', 'Mission Road', 'Boro Station'] }
        }
      },
      'Lakshmipur': {
        name: 'লক্ষ্মীপুর জেলা',
        thanas: {
          'Lakshmipur Sadar': { name: 'লক্ষ্মীপুর সদর', neighborhoods: ['Jhumur Cinema Mor', 'Madam Bridge', 'Uttar Bazar', 'Dakshin Bazar'] }
        }
      },
      'Khagrachhari': {
        name: 'খাগড়াছড়ি জেলা',
        thanas: {
          'Khagrachhari Sadar': { name: 'খাগড়াছড়ি সদর', neighborhoods: ['Mahajan Para', 'Pankhaiya Para', 'Court Area', 'Chegi Square'] }
        }
      },
      'Rangamati': {
        name: 'রাঙ্গামাটি জেলা',
        thanas: {
          'Rangamati Sadar': { name: 'রাঙ্গামাটি সদর', neighborhoods: ['Tabalchhari', 'Banarupa', 'Reserve Bazar', 'Vedvedi'] }
        }
      },
      'Bandarban': {
        name: 'বান্দরবান জেলা',
        thanas: {
          'Bandarban Sadar': { name: 'বান্দরবান সদর', neighborhoods: ['Balaghata', 'Uzani Para', 'Madhyam Para', 'Kazi Para'] }
        }
      }
    }
  },
  'Rajshahi': {
    name: 'রাজশাহী বিভাগ',
    districts: {
      'Rajshahi': {
        name: 'রাজশাহী জেলা',
        thanas: {
          'Boalia': { name: 'বোয়ালিয়া', neighborhoods: ['Shaheb Bazar', 'Alupatti', 'Ghoramara', 'Ranibazar', 'Kumarpara'] },
          'Motihar': { name: 'মতিহার', neighborhoods: ['RU Campus', 'Kajla', 'Binodpur', 'Meherchandi', 'Ruet Area'] },
          'Rajpara': { name: 'রাজপাড়া', neighborhoods: ['Laxmipur', 'Court Area', 'C&B Mor', 'Hossainiganj'] },
          'Chandrima': { name: 'চন্দ্রিমা', neighborhoods: ['Bhadra', 'Padma R/A', 'Railway Colony', 'Shiroil'] },
          'Shah Makhdum': { name: 'শাহ মখদুম', neighborhoods: ['Airport Road', 'Naodapara', 'Postal Colony'] }
        }
      },
      'Bogura': {
        name: 'বগুড়া জেলা',
        thanas: {
          'Bogura Sadar': { name: 'বগুড়া সদর', neighborhoods: ['Satmatha', 'Jaleshwaritola', 'Thanthania', 'Sutrapur', 'Malitinagar', 'Katnarpara', 'Chelopara'] }
        }
      },
      'Pabna': {
        name: 'পাবনা জেলা',
        thanas: {
          'Pabna Sadar': { name: 'পাবনা সদর', neighborhoods: ['Abdul Hamid Road', 'Gopalpur', 'Radhanagar', 'Dilalpur', 'Shalgaria'] },
          'Ishwardi': { name: 'ঈশ্বরদী', neighborhoods: ['Ishwardi Bazar', 'Rooppur Area', 'Railway Junction'] }
        }
      },
      'Sirajganj': {
        name: 'সিরাজগঞ্জ জেলা',
        thanas: {
          'Sirajganj Sadar': { name: 'সিরাজগঞ্জ সদর', neighborhoods: ['S.S. Road', 'Mujib Sarak', 'Ekdala', 'Kalia Haripur', 'Masimpur'] }
        }
      },
      'Naogaon': {
        name: 'নওগাঁ জেলা',
        thanas: {
          'Naogaon Sadar': { name: 'নওগাঁ সদর', neighborhoods: ['Muktir Mor', 'Kazipara', 'Par-Naogaon', 'Chalkdeb', 'Bata Mor'] }
        }
      },
      'Natore': {
        name: 'নাটোর জেলা',
        thanas: {
          'Natore Sadar': { name: 'নাটোর সদর', neighborhoods: ['Kanaikhali', 'Nichabazar', 'Station Road', 'Harishpur', 'Madrasa Mor'] }
        }
      },
      'Joypurhat': {
        name: 'জয়পুরহাট জেলা',
        thanas: {
          'Joypurhat Sadar': { name: 'জয়পুরহাট সদর', neighborhoods: ['Station Road', 'Bus Stand', 'Notunhat', 'Sadullapur Road'] }
        }
      },
      'Chapainawabganj': {
        name: 'চাঁপাইনবাবগঞ্জ জেলা',
        thanas: {
          'Chapainawabganj Sadar': { name: 'চাঁপাইনবাবগঞ্জ সদর', neighborhoods: ['Shibtala', 'Shantir Mor', 'Baroghoria', 'Nimtola', 'Puratan Bazar'] }
        }
      }
    }
  },
  'Khulna': {
    name: 'খুলনা বিভাগ',
    districts: {
      'Khulna': {
        name: 'খুলনা জেলা',
        thanas: {
          'Khulna Sadar': { name: 'খুলনা সদর', neighborhoods: ['Rupsha', 'Dakbangla', 'KDA Avenue', 'Boyra', 'Sonadanga', 'Gallamari', 'Moilapota'] },
          'Sonadanga': { name: 'সোনাডাঙ্গা', neighborhoods: ['Sonadanga R/A', 'Bus Terminal Area', 'Mujgunni', 'Boyra Main Road'] },
          'Khalishpur': { name: 'খালিশপুর', neighborhoods: ['Khalishpur Housing Estate', 'BIDC Road', 'Chitralee Mor'] },
          'Daulatpur': { name: 'দৌলতপুর', neighborhoods: ['Daulatpur Bazar', 'BL College Area', 'Raligate'] }
        }
      },
      'Jashore': {
        name: 'যশোর জেলা',
        thanas: {
          'Jashore Sadar': { name: 'যশোর সদর', neighborhoods: ['Doratana', 'Garikhana', 'Churamonkathi', 'Chanchra', 'Ghop', 'Rail Station Area'] }
        }
      },
      'Kushtia': {
        name: 'কুষ্টিয়া জেলা',
        thanas: {
          'Kushtia Sadar': { name: 'কুষ্টিয়া সদর', neighborhoods: ['Majampur', 'Court Para', 'NS Road', 'Chourhas', 'Mill Line'] }
        }
      },
      'Jhenaidah': {
        name: 'ঝিনাইদহ জেলা',
        thanas: {
          'Jhenaidah Sadar': { name: 'ঝিনাইদহ সদর', neighborhoods: ['Post Office Mor', 'Payra Chottor', 'Hamdah', 'Arapur', 'Choto Kamarkundu'] }
        }
      },
      'Satkhira': {
        name: 'সাতক্ষীরা জেলা',
        thanas: {
          'Satkhira Sadar': { name: 'সাতক্ষীরা সদর', neighborhoods: ['Sultanpur', 'Palashpole', 'Itagachha', 'Taltola', 'Khamarbari'] }
        }
      },
      'Bagerhat': {
        name: 'বাগেরহাট জেলা',
        thanas: {
          'Bagerhat Sadar': { name: 'বাগেরহাট সদর', neighborhoods: ['Dashani', 'Mithapukur Par', 'Rahamatganj', 'Bus Stand Area'] }
        }
      },
      'Chuadanga': {
        name: 'চুয়াডাঙ্গা জেলা',
        thanas: {
          'Chuadanga Sadar': { name: 'চুয়াডাঙ্গা সদর', neighborhoods: ['Court Road', 'Shahid Abul Kashem Sarak', 'Academy Mor', 'Cinema Hall Road'] }
        }
      },
      'Magura': {
        name: 'মাগুরা জেলা',
        thanas: {
          'Magura Sadar': { name: 'মাগুরা সদর', neighborhoods: ['Dhaka Road', 'Syed Ator Ali Road', 'Puran Bazar', 'Chouranghee Mor'] }
        }
      },
      'Meherpur': {
        name: 'মেহেরপুর জেলা',
        thanas: {
          'Meherpur Sadar': { name: 'মেহেরপুর সদর', neighborhoods: ['Main Road', 'Court Area', 'Hotel Bazar', 'Boshpara'] }
        }
      },
      'Narail': {
        name: 'নড়াইল জেলা',
        thanas: {
          'Narail Sadar': { name: 'নড়াইল সদর', neighborhoods: ['Rupganj', 'Kurigram', 'Mohishkhola', 'Chowrasta'] }
        }
      }
    }
  },
  'Barishal': {
    name: 'বরিশাল বিভাগ',
    districts: {
      'Barishal': {
        name: 'বরিশাল জেলা',
        thanas: {
          'Barishal Sadar (Kotwali)': { name: 'বরিশাল সদর / কোতোয়ালী', neighborhoods: ['Sadar Road', 'Natullabad', 'Rupatali', 'Band Road', 'Alekanda', 'Choumatha', 'Bibichar Pond Area'] }
        }
      },
      'Patuakhali': {
        name: 'পটুয়াখালী জেলা',
        thanas: {
          'Patuakhali Sadar': { name: 'পটুয়াখালী সদর', neighborhoods: ['Launch Ghat Road', 'Chawkbazar', 'College Road', 'Puran Bazar'] },
          'Kuakata': { name: 'কুয়াকাটা', neighborhoods: ['Beach Area', 'Zero Point', 'Parjatan Mor'] }
        }
      },
      'Bhola': {
        name: 'ভোলা জেলা',
        thanas: {
          'Bhola Sadar': { name: 'ভোলা সদর', neighborhoods: ['Ukil Para', 'Mahajan Patti', 'Kalinath Roy Bazar', 'Natun Bazar'] }
        }
      },
      'Pirojpur': {
        name: 'পিরোজপুর জেলা',
        thanas: {
          'Pirojpur Sadar': { name: 'পিরোজপুর সদর', neighborhoods: ['Parerhat Road', 'Sadar Hospital Road', 'Boro Pool Mor', 'Puran Bazar'] }
        }
      },
      'Barguna': {
        name: 'বরগুনা জেলা',
        thanas: {
          'Barguna Sadar': { name: 'বরগুনা সদর', neighborhoods: ['Siraj Uddin Sarak', 'Launch Ghat Area', 'Krok Area', 'Barguna Bazar'] }
        }
      },
      'Jhalokati': {
        name: 'ঝালকাঠি জেলা',
        thanas: {
          'Jhalokati Sadar': { name: 'ঝালকাঠি সদর', neighborhoods: ['Chandkati', 'Bauthangal', 'College Mor', 'Kashari Patti'] }
        }
      }
    }
  },
  'Sylhet': {
    name: 'সিলেট বিভাগ',
    districts: {
      'Sylhet': {
        name: 'সিলেট জেলা',
        thanas: {
          'Sylhet Sadar / Kotwali': { name: 'সিলেট সদর / কোতোয়ালী', neighborhoods: ['Zindabazar', 'Amberkhana', 'Shibganj', 'Upashahar', 'Chowhatta', 'Tilagarh', 'Subidbazar', 'Pathantula', 'Kumarpara', 'Lamabazar'] },
          'South Surma': { name: 'দক্ষিণ সুরমা', neighborhoods: ['Kadamtali', 'Humayun Rashid Chottor', 'Boroikandi', 'Chandai'] },
          'Shah Paran': { name: 'শাহপরান', neighborhoods: ['Shah Paran Gate', 'Baluchor', 'Tultikar', 'Majortilla'] }
        }
      },
      'Moulvibazar': {
        name: 'মৌলভীবাজার জেলা',
        thanas: {
          'Moulvibazar Sadar': { name: 'মৌলভীবাজার সদর', neighborhoods: ['Court Road', 'Sreemangal Road', 'Kusumbag', 'Chowmuhani', 'Shamshernagar Road'] },
          'Sreemangal': { name: 'শ্রীমঙ্গল', neighborhoods: ['Radhanagar', 'College Road', 'Station Road', 'Chourangi'] }
        }
      },
      'Habiganj': {
        name: 'হবিগঞ্জ জেলা',
        thanas: {
          'Habiganj Sadar': { name: 'হবিগঞ্জ সদর', neighborhoods: ['Shaistanagar', 'Town Hall Road', 'Cinema Hall Mor', 'Chowdhury Bazar'] }
        }
      },
      'Sunamganj': {
        name: 'সুনামগঞ্জ জেলা',
        thanas: {
          'Sunamganj Sadar': { name: 'সুনামগঞ্জ সদর', neighborhoods: ['Hason Nagar', 'Traffic Point', 'Puratan Bus Stand', 'Madhyanagar'] }
        }
      }
    }
  },
  'Rangpur': {
    name: 'রংপুর বিভাগ',
    districts: {
      'Rangpur': {
        name: 'রংপুর জেলা',
        thanas: {
          'Rangpur Sadar / Kotwali': { name: 'রংপুর সদর / কোতোয়ালী', neighborhoods: ['Jahaj Company Mor', 'Dhap', 'Modern Mor', 'Lalbagh', 'Carmichael College Area', 'Radhaballabh', 'RK Road', 'Kachari Bazar'] }
        }
      },
      'Dinajpur': {
        name: 'দিনাজপুর জেলা',
        thanas: {
          'Dinajpur Sadar': { name: 'দিনাজপুর সদর', neighborhoods: ['Ghashipara', 'Nimtola', 'Balubari', 'Paharpur', 'Station Road', 'Munshipara'] }
        }
      },
      'Thakurgaon': {
        name: 'ঠাকুরগাঁও জেলা',
        thanas: {
          'Thakurgaon Sadar': { name: 'ঠাকুরগাঁও সদর', neighborhoods: ['Masterpara', 'Sarkarpara', 'Gobindanagar', 'Basirpara', 'Hazipara', 'Station Road', 'Kalibari', 'Chourasta'] },
          'Pirganj': { name: 'পীরগঞ্জ', neighborhoods: ['Pirganj Bazar', 'Station Mor'] },
          'Ranisankail': { name: 'রাণীশংকৈল', neighborhoods: ['Ranisankail Bazar', 'Shibdighi'] }
        }
      },
      'Panchagarh': {
        name: 'পঞ্চগড় জেলা',
        thanas: {
          'Panchagarh Sadar': { name: 'পঞ্চগড় সদর', neighborhoods: ['Dokropara', 'Cinema Hall Mor', 'Stadium Road', 'Chowrangi Mor'] },
          'Tetulia': { name: 'তেঁতুলিয়া', neighborhoods: ['Tetulia Bazar', 'Dakbangla Area', 'Banglabandha Port Area'] }
        }
      },
      'Nilphamari': {
        name: 'নীলফামারী জেলা',
        thanas: {
          'Nilphamari Sadar': { name: 'নীলফামারী সদর', neighborhoods: ['Babupara', 'Notun Bazar', 'Chourangi Mor', 'College Station'] },
          'Saidpur': { name: 'সৈয়দপুর', neighborhoods: ['Cantt Road', 'Railgate', 'Golahat', 'Naya Bazar'] }
        }
      },
      'Kurigram': {
        name: 'কুড়িগ্রাম জেলা',
        thanas: {
          'Kurigram Sadar': { name: 'কুড়িগ্রাম সদর', neighborhoods: ['Ghoshpara', 'College Mor', 'Tri-Mohoni', 'Zila Parishad Area'] }
        }
      },
      'Gaibandha': {
        name: 'গাইবান্ধা জেলা',
        thanas: {
          'Gaibandha Sadar': { name: 'গাইবান্ধা সদর', neighborhoods: ['D.B. Road', 'Circular Road', 'Masterpara', 'Station Road'] }
        }
      },
      'Lalmonirhat': {
        name: 'লালমনিরহাট জেলা',
        thanas: {
          'Lalmonirhat Sadar': { name: 'লালমনিরহাট সদর', neighborhoods: ['BDR Hat', 'Mission Mor', 'Thana Mor', 'Goshala Mor'] }
        }
      }
    }
  },
  'Mymensingh': {
    name: 'ময়মনসিংহ বিভাগ',
    districts: {
      'Mymensingh': {
        name: 'ময়মনসিংহ জেলা',
        thanas: {
          'Mymensingh Sadar / Kotwali': { name: 'ময়মনসিংহ সদর / কোতোয়ালী', neighborhoods: ['Ganginar Par', 'Charpara', 'Town Hall', 'Maskanda', 'Notun Bazar', 'Akua', 'Krishtapur', 'BAU Campus', 'Kachari Mor'] }
        }
      },
      'Jamalpur': {
        name: 'জামালপুর জেলা',
        thanas: {
          'Jamalpur Sadar': { name: 'জামালপুর সদর', neighborhoods: ['Station Road', 'Tamij Uddin Road', 'College Road', 'Bakultala', 'Gatepar'] }
        }
      },
      'Netrokona': {
        name: 'নেত্রকোণা জেলা',
        thanas: {
          'Netrokona Sadar': { name: 'নেত্রকোণা সদর', neighborhoods: ['Mokterpara', 'Choto Bazar', 'Boro Bazar', 'Kurpar', 'Nagra'] }
        }
      },
      'Sherpur': {
        name: 'শেরপুর জেলা',
        thanas: {
          'Sherpur Sadar': { name: 'শেরপুর সদর', neighborhoods: ['Raghunath Bazar', 'Nayanibazar', 'Mirganj', 'Giri Narayanpur'] }
        }
      }
    }
  }
};
