export interface FamilyWelcomeGreeting {
  familyId: string;
  audioClipId: string;
  nativePhrase: string;
  spokenPhrase: string;
  phoneticGuide: string;
  languageName: string;
  langTag: string;
  meaningEn: string;
}

export const LANGUAGE_FAMILY_GREETINGS: Record<string, FamilyWelcomeGreeting> = {
  'niger-congo': {
    familyId: 'niger-congo',
    audioClipId: 'family-niger-congo',
    nativePhrase: 'Karibu Afriata—Mvumbuzi wa Kikabila wa Atlantiki.',
    spokenPhrase: 'Welcome to the Niger-Congo linguistic phylum, home to over 1,500 living languages across Africa.',
    phoneticGuide: '[kaˈri.bu af.riˈka.li.a]',
    languageName: 'Kiswahili & Niger-Congo',
    langTag: 'sw-KE',
    meaningEn: 'Welcome to Afriata—The Atlantic Ethnic Explorer.'
  },
  'afroasiatic': {
    familyId: 'afroasiatic',
    audioClipId: 'family-afroasiatic',
    nativePhrase: 'Barka da zuwa Afriata—Mai Binciken Kabilun Atlantika.',
    spokenPhrase: 'Welcome to the Afroasiatic phylum, spanning the Sahara, Horn of Africa, and North African civilizations.',
    phoneticGuide: '[bar.ka da zu.wa af.riˈka.li.a]',
    languageName: 'Hausa & Afroasiatic',
    langTag: 'ha-NG',
    meaningEn: 'Welcome to Afriata—The Atlantic Ethnic Explorer.'
  },
  'nilo-saharan': {
    familyId: 'nilo-saharan',
    audioClipId: 'family-nilo-saharan',
    nativePhrase: 'Yawa, karibu Afriata—Jagol kido mar Atlantic.',
    spokenPhrase: 'Welcome to the Nilo-Saharan language family, tracing ancient corridors from the Nile Basin to Central Africa.',
    phoneticGuide: '[ya.wa ka.ri.bu jag.ol ki.do]',
    languageName: 'Luo & Nilo-Saharan',
    langTag: 'luo-KE',
    meaningEn: 'Welcome to Afriata—The Atlantic Ethnic Explorer.'
  },
  'austronesian': {
    familyId: 'austronesian',
    audioClipId: 'family-austronesian',
    nativePhrase: 'Tonga soa eto amin\'ny Afriata—Mpikaroka ny foko Atlantika.',
    spokenPhrase: 'Welcome to the Austronesian phylum in Africa, connecting Madagascar and the Indian Ocean rim.',
    phoneticGuide: '[tʊŋ.ɡa su.a e.tu a.min.ni]',
    languageName: 'Malagasy & Austronesian',
    langTag: 'mg-MG',
    meaningEn: 'Welcome to Afriata—The Atlantic Ethnic Explorer.'
  },
  'khoisan': {
    familyId: 'khoisan',
    audioClipId: 'family-khoisan',
    nativePhrase: 'ǁKhawa ǃgû re Afriata—Atlantic ǃAosab ǃKhôa-aos.',
    spokenPhrase: 'Welcome to the Khoe-San linguistic families, representing humanity\'s deepest surviving phonetic heritages.',
    phoneticGuide: '[ǁkʰa.wa ǃɡuː re af.riˈka.li.a]',
    languageName: 'Nama & Khoe-San',
    langTag: 'naq-NA',
    meaningEn: 'Welcome to Afriata—The Atlantic Ethnic Explorer.'
  },
  'indo-european': {
    familyId: 'indo-european',
    audioClipId: 'family-indo-european',
    nativePhrase: 'Bem-bindu na Afriata—Splorador Étniku di Atlântiku.',
    spokenPhrase: 'Welcome to Atlantic Creoles and Indo-European linguistic heritages across continental and island states.',
    phoneticGuide: '[bẽj̃ˈbĩdu na af.riˈka.li.a]',
    languageName: 'Kriolu & Atlantic Creoles',
    langTag: 'pt-CV',
    meaningEn: 'Welcome to Afriata—The Atlantic Ethnic Explorer.'
  }
};
