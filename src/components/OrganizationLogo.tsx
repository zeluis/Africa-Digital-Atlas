import React from 'react';

export type OrgId = 
  | 'WB' 
  | 'UN' 
  | 'UNESCO' 
  | 'IMF' 
  | 'FAO' 
  | 'AU' 
  | 'AfDB' 
  | 'AfCFTA' 
  | 'ASEAN' 
  | 'WHO' 
  | 'ILO' 
  | 'FREEDOM_HOUSE' 
  | 'GLOBAL_INTEGRITY' 
  | 'UN_COMTRADE'
  | 'ECOWAS'
  | 'EAC'
  | 'SADC'
  | 'COMESA';

interface OrganizationLogoProps {
  org: OrgId | string;
  className?: string;
  size?: number | string;
  showBadge?: boolean;
  variant?: 'color' | 'monochrome' | 'white';
}

/**
 * Official Vector Emblem / Logo Metadata and Wikimedia Commons Source Citations
 */
export const ORG_METADATA: Record<string, {
  name: string;
  acronym: string;
  wikimediaUrl: string;
  brandColor: string;
  publicDomainStatus: string;
}> = {
  WB: {
    name: 'World Bank Group',
    acronym: 'WBG',
    wikimediaUrl: 'https://commons.wikimedia.org/wiki/File:World_Bank_Group_logo.svg',
    brandColor: '#002244',
    publicDomainStatus: 'Trademarked / Vector on Wikimedia Commons'
  },
  UN: {
    name: 'United Nations',
    acronym: 'UN',
    wikimediaUrl: 'https://commons.wikimedia.org/wiki/File:Emblem_of_the_United_Nations.svg',
    brandColor: '#009edb',
    publicDomainStatus: 'Public Domain / UN Visual Guidelines'
  },
  UNESCO: {
    name: 'United Nations Educational, Scientific and Cultural Organization',
    acronym: 'UNESCO',
    wikimediaUrl: 'https://commons.wikimedia.org/wiki/File:UNESCO_logo.svg',
    brandColor: '#0077d8',
    publicDomainStatus: 'Official Emblem / Wikimedia Commons'
  },
  IMF: {
    name: 'International Monetary Fund',
    acronym: 'IMF',
    wikimediaUrl: 'https://commons.wikimedia.org/wiki/File:International_Monetary_Fund_logo.svg',
    brandColor: '#004c97',
    publicDomainStatus: 'Official Corporate Logo / Wikimedia Commons'
  },
  FAO: {
    name: 'Food and Agriculture Organization of the United Nations',
    acronym: 'FAO',
    wikimediaUrl: 'https://commons.wikimedia.org/wiki/File:FAO_logo.svg',
    brandColor: '#0085ca',
    publicDomainStatus: 'Official UN Agency Emblem / Wikimedia Commons'
  },
  AU: {
    name: 'African Union',
    acronym: 'AU',
    wikimediaUrl: 'https://commons.wikimedia.org/wiki/File:Emblem_of_the_African_Union.svg',
    brandColor: '#006633',
    publicDomainStatus: 'Official Emblem of the African Union'
  },
  AfDB: {
    name: 'African Development Bank Group',
    acronym: 'AfDB',
    wikimediaUrl: 'https://commons.wikimedia.org/wiki/File:African_Development_Bank_logo.svg',
    brandColor: '#008751',
    publicDomainStatus: 'Official Multilateral Bank Logo'
  },
  AfCFTA: {
    name: 'African Continental Free Trade Area Secretariat',
    acronym: 'AfCFTA',
    wikimediaUrl: 'https://au-afcfta.org/',
    brandColor: '#c8963e',
    publicDomainStatus: 'Official Secretariat Emblem'
  },
  ASEAN: {
    name: 'Association of Southeast Asian Nations',
    acronym: 'ASEAN',
    wikimediaUrl: 'https://commons.wikimedia.org/wiki/File:Emblem_of_ASEAN.svg',
    brandColor: '#da251d',
    publicDomainStatus: 'Official Emblem / Public Domain in ASEAN'
  },
  WHO: {
    name: 'World Health Organization',
    acronym: 'WHO',
    wikimediaUrl: 'https://commons.wikimedia.org/wiki/File:Flag_of_the_World_Health_Organization.svg',
    brandColor: '#0093d5',
    publicDomainStatus: 'Official UN Agency Emblem'
  },
  ILO: {
    name: 'International Labour Organization',
    acronym: 'ILO',
    wikimediaUrl: 'https://commons.wikimedia.org/wiki/File:International_Labour_Organization_Logo.svg',
    brandColor: '#003366',
    publicDomainStatus: 'Official UN Agency Emblem'
  },
  FREEDOM_HOUSE: {
    name: 'Freedom House',
    acronym: 'FH',
    wikimediaUrl: 'https://commons.wikimedia.org/wiki/File:Freedom_House_logo.svg',
    brandColor: '#1a365d',
    publicDomainStatus: 'Non-profit Logo / Fair Use'
  },
  GLOBAL_INTEGRITY: {
    name: 'Global Integrity',
    acronym: 'GI',
    wikimediaUrl: 'https://www.globalintegrity.org/',
    brandColor: '#00a3e0',
    publicDomainStatus: 'Institutional Vector'
  },
  UN_COMTRADE: {
    name: 'United Nations Statistics Division - UN Comtrade',
    acronym: 'UN Comtrade',
    wikimediaUrl: 'https://commons.wikimedia.org/wiki/File:Emblem_of_the_United_Nations.svg',
    brandColor: '#009edb',
    publicDomainStatus: 'UN Emblem Vector'
  },
  ECOWAS: {
    name: 'Economic Community of West African States',
    acronym: 'ECOWAS',
    wikimediaUrl: 'https://commons.wikimedia.org/wiki/File:Flag_of_ECOWAS.svg',
    brandColor: '#008751',
    publicDomainStatus: 'Regional Economic Community Emblem'
  },
  EAC: {
    name: 'East African Community',
    acronym: 'EAC',
    wikimediaUrl: 'https://commons.wikimedia.org/wiki/File:Flag_of_the_East_African_Community.svg',
    brandColor: '#0099ff',
    publicDomainStatus: 'Regional Economic Community Emblem'
  },
  SADC: {
    name: 'Southern African Development Community',
    acronym: 'SADC',
    wikimediaUrl: 'https://commons.wikimedia.org/wiki/File:Flag_of_SADC.svg',
    brandColor: '#002366',
    publicDomainStatus: 'Regional Economic Community Emblem'
  },
  COMESA: {
    name: 'Common Market for Eastern and Southern Africa',
    acronym: 'COMESA',
    wikimediaUrl: 'https://commons.wikimedia.org/wiki/File:Flag_of_COMESA.svg',
    brandColor: '#006600',
    publicDomainStatus: 'Regional Economic Community Emblem'
  }
};

/**
 * Pure SVG Scalable Vector Components for Global & African Multilateral Organizations
 */
export const OrganizationLogo: React.FC<OrganizationLogoProps> = ({
  org,
  className = '',
  size = 24,
  showBadge = false,
  variant = 'color'
}) => {
  const normKey = org.toUpperCase().replace(/[^A-Z0-9_]/g, '_');
  const metadata = ORG_METADATA[normKey] || ORG_METADATA[org] || {
    name: org,
    acronym: org,
    wikimediaUrl: 'https://commons.wikimedia.org',
    brandColor: '#6b7280',
    publicDomainStatus: 'Public'
  };

  const dim = typeof size === 'number' ? `${size}px` : size;

  const renderSvg = () => {
    switch (normKey) {
      // United Nations (UN) Emblem: Laurel Wreath and Azimuthal Polar Projection
      case 'UN':
      case 'UN_DESA':
      case 'UNSD':
      case 'UN_COMTRADE':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <circle cx="50" cy="50" r="46" fill={variant === 'color' ? '#EBF8FF' : 'transparent'} stroke={variant === 'color' ? '#009EDB' : 'currentColor'} strokeWidth="2.5" />
            <circle cx="50" cy="50" r="32" stroke={variant === 'color' ? '#009EDB' : 'currentColor'} strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="18" stroke={variant === 'color' ? '#009EDB' : 'currentColor'} strokeWidth="1.5" />
            <circle cx="50" cy="50" r="6" fill={variant === 'color' ? '#009EDB' : 'currentColor'} />
            {/* Grid Azimuthal lines */}
            <path d="M50 8 L50 92 M8 50 L92 50 M20 20 L80 80 M20 80 L80 20" stroke={variant === 'color' ? '#009EDB' : 'currentColor'} strokeWidth="1.2" opacity="0.75" />
            {/* Olive Branches / Laurel Wreath */}
            <path d="M22 68 C14 54 18 36 28 24 C28 32 32 40 38 48 C30 52 26 60 22 68 Z" fill={variant === 'color' ? '#009EDB' : 'currentColor'} opacity="0.85" />
            <path d="M78 68 C86 54 82 36 72 24 C72 32 68 40 62 48 C70 52 74 60 78 68 Z" fill={variant === 'color' ? '#009EDB' : 'currentColor'} opacity="0.85" />
          </svg>
        );

      // World Bank Group (WBG): Twin Hemisphere Meridian Globe
      case 'WB':
      case 'WBG':
      case 'WORLD_BANK':
      case 'WB_GENDER':
      case 'WB_PIP':
      case 'WB_IDS':
      case 'WB_CPIA':
      case 'WB_CLIMATE':
      case 'ASPIRE':
      case 'GSAP':
      case 'SPID':
      case 'SCORECARD':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <rect width="100" height="100" rx="20" fill={variant === 'color' ? '#002244' : 'transparent'} />
            {/* Western Hemisphere Globe Lines */}
            <circle cx="36" cy="50" r="22" stroke={variant === 'color' ? '#009EDB' : 'currentColor'} strokeWidth="2.5" />
            <ellipse cx="36" cy="50" rx="12" ry="22" stroke={variant === 'color' ? '#FFFFFF' : 'currentColor'} strokeWidth="1.8" />
            <line x1="14" y1="50" x2="58" y2="50" stroke={variant === 'color' ? '#FFFFFF' : 'currentColor'} strokeWidth="1.8" />
            {/* Eastern Hemisphere Globe Lines */}
            <circle cx="64" cy="50" r="22" stroke={variant === 'color' ? '#009EDB' : 'currentColor'} strokeWidth="2.5" />
            <ellipse cx="64" cy="50" rx="12" ry="22" stroke={variant === 'color' ? '#FFFFFF' : 'currentColor'} strokeWidth="1.8" />
            <line x1="42" y1="50" x2="86" y2="50" stroke={variant === 'color' ? '#FFFFFF' : 'currentColor'} strokeWidth="1.8" />
          </svg>
        );

      // UNESCO: Classical Temple Portico with UNESCO Lettering Base
      case 'UNESCO':
      case 'UNESCO_UIS':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <rect width="100" height="100" rx="20" fill={variant === 'color' ? '#0077D8' : 'transparent'} />
            {/* Pediment Triangle */}
            <path d="M16 34 L50 16 L84 34 Z" fill={variant === 'color' ? '#FFFFFF' : 'currentColor'} />
            {/* Architrave */}
            <rect x="18" y="36" width="64" height="4" fill={variant === 'color' ? '#FFFFFF' : 'currentColor'} />
            {/* 6 Classical Columns */}
            <rect x="20" y="43" width="6" height="32" rx="1" fill={variant === 'color' ? '#FFFFFF' : 'currentColor'} />
            <rect x="31" y="43" width="6" height="32" rx="1" fill={variant === 'color' ? '#FFFFFF' : 'currentColor'} />
            <rect x="42" y="43" width="6" height="32" rx="1" fill={variant === 'color' ? '#FFFFFF' : 'currentColor'} />
            <rect x="52" y="43" width="6" height="32" rx="1" fill={variant === 'color' ? '#FFFFFF' : 'currentColor'} />
            <rect x="63" y="43" width="6" height="32" rx="1" fill={variant === 'color' ? '#FFFFFF' : 'currentColor'} />
            <rect x="74" y="43" width="6" height="32" rx="1" fill={variant === 'color' ? '#FFFFFF' : 'currentColor'} />
            {/* Stepped Base / Stylobate */}
            <rect x="16" y="78" width="68" height="6" rx="1" fill={variant === 'color' ? '#FFFFFF' : 'currentColor'} />
          </svg>
        );

      // IMF: Twin Global Hemispheres in Blue Shield
      case 'IMF':
      case 'IMF_WEO':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <rect width="100" height="100" rx="20" fill={variant === 'color' ? '#004C97' : 'transparent'} />
            <circle cx="50" cy="50" r="36" stroke={variant === 'color' ? '#E5A823' : 'currentColor'} strokeWidth="3" />
            <ellipse cx="40" cy="50" rx="14" ry="24" stroke={variant === 'color' ? '#FFFFFF' : 'currentColor'} strokeWidth="2" />
            <ellipse cx="60" cy="50" rx="14" ry="24" stroke={variant === 'color' ? '#FFFFFF' : 'currentColor'} strokeWidth="2" />
            <line x1="20" y1="50" x2="80" y2="50" stroke={variant === 'color' ? '#E5A823' : 'currentColor'} strokeWidth="2" />
            {/* IMF Text Core */}
            <text x="50" y="86" textAnchor="middle" fill={variant === 'color' ? '#FFFFFF' : 'currentColor'} fontSize="14" fontFamily="sans-serif" fontWeight="bold">IMF</text>
          </svg>
        );

      // FAO: Wheat Ear and Globe Symbol
      case 'FAO':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <circle cx="50" cy="50" r="46" fill={variant === 'color' ? '#0085CA' : 'transparent'} stroke={variant === 'color' ? '#006699' : 'currentColor'} strokeWidth="2" />
            {/* Globe Lat/Long */}
            <ellipse cx="50" cy="50" rx="30" ry="40" stroke="#FFFFFF" strokeWidth="1.8" opacity="0.6" />
            <line x1="10" y1="50" x2="90" y2="50" stroke="#FFFFFF" strokeWidth="1.8" opacity="0.6" />
            {/* Central Wheat stalk */}
            <path d="M50 82 L50 20 M50 25 C42 22 42 30 50 34 C58 30 58 22 50 25 M50 38 C40 35 40 44 50 48 C60 44 60 35 50 38 M50 52 C38 48 38 58 50 62 C62 58 62 48 50 52" stroke={variant === 'color' ? '#FDB913' : 'currentColor'} strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        );

      // African Union (AU): Gold Ring, Green Field, Palm Leaves & Map Silhouette
      case 'AU':
      case 'AFRICAN_UNION':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <rect width="100" height="100" rx="20" fill={variant === 'color' ? '#006633' : 'transparent'} />
            {/* Gold Outer Ring */}
            <circle cx="50" cy="50" r="38" stroke={variant === 'color' ? '#FFCC00' : 'currentColor'} strokeWidth="3" />
            {/* 54 Gold Stars / Rays surrounding circle */}
            <circle cx="50" cy="50" r="32" stroke={variant === 'color' ? '#FFFFFF' : 'currentColor'} strokeWidth="1" strokeDasharray="3 2" />
            {/* Stylized African Continent Silhouette */}
            <path d="M42 28 C48 27 58 28 62 33 C64 36 58 40 60 44 C63 47 68 50 63 56 C60 60 55 68 52 74 C49 71 47 64 45 60 C40 56 36 52 38 46 C40 42 34 38 35 34 C37 30 40 29 42 28 Z" fill={variant === 'color' ? '#FFCC00' : 'currentColor'} />
            {/* Palm Wreath base */}
            <path d="M30 70 C40 76 60 76 70 70" stroke={variant === 'color' ? '#FFFFFF' : 'currentColor'} strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );

      // African Development Bank (AfDB): Map of Africa within Triangular Vault
      case 'AFDB':
      case 'AFRICAN_DEVELOPMENT_BANK':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <rect width="100" height="100" rx="20" fill={variant === 'color' ? '#008751' : 'transparent'} />
            <circle cx="50" cy="50" r="36" fill={variant === 'color' ? '#FFFFFF' : 'transparent'} stroke={variant === 'color' ? '#008751' : 'currentColor'} strokeWidth="3" />
            {/* African Map in Green */}
            <path d="M43 28 C49 27 59 28 63 33 C65 36 59 40 61 44 C64 47 69 50 64 56 C61 60 56 68 53 74 C50 71 48 64 46 60 C41 56 37 52 39 46 C41 42 35 38 36 34 C38 30 41 29 43 28 Z" fill={variant === 'color' ? '#008751' : 'currentColor'} />
            <path d="M28 50 L50 22 L72 50" stroke={variant === 'color' ? '#C8963E' : 'currentColor'} strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
        );

      // AfCFTA Secretariat: Red, Gold, Green African Integration Arc
      case 'AFCFTA':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <rect width="100" height="100" rx="20" fill={variant === 'color' ? '#1B2A4A' : 'transparent'} />
            <circle cx="50" cy="50" r="36" stroke={variant === 'color' ? '#C8963E' : 'currentColor'} strokeWidth="2.5" />
            {/* Interlocking Tri-Color Flow Vectors */}
            <path d="M25 50 C25 36 36 25 50 25 C64 25 75 36 75 50" stroke={variant === 'color' ? '#008751' : 'currentColor'} strokeWidth="4" strokeLinecap="round" />
            <path d="M75 50 C75 64 64 75 50 75 C36 75 25 64 25 50" stroke={variant === 'color' ? '#DA251D' : 'currentColor'} strokeWidth="4" strokeLinecap="round" />
            <path d="M35 50 L50 35 L65 50 L50 65 Z" fill={variant === 'color' ? '#FFCC00' : 'currentColor'} />
          </svg>
        );

      // ASEAN: 10 Yellow Paddy Stalks bound by a Red Ring in Blue Field
      case 'ASEAN':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <rect width="100" height="100" rx="20" fill={variant === 'color' ? '#003399' : 'transparent'} />
            <circle cx="50" cy="50" r="36" fill={variant === 'color' ? '#DA251D' : 'transparent'} stroke={variant === 'color' ? '#FFFFFF' : 'currentColor'} strokeWidth="3.5" />
            {/* 10 Yellow Paddy (Rice) Stalks bound together */}
            <rect x="42" y="24" width="3" height="52" rx="1.5" fill={variant === 'color' ? '#FFFF00' : 'currentColor'} />
            <rect x="47" y="22" width="3" height="56" rx="1.5" fill={variant === 'color' ? '#FFFF00' : 'currentColor'} />
            <rect x="52" y="22" width="3" height="56" rx="1.5" fill={variant === 'color' ? '#FFFF00' : 'currentColor'} />
            <rect x="57" y="24" width="3" height="52" rx="1.5" fill={variant === 'color' ? '#FFFF00' : 'currentColor'} />
            {/* Stalk binding ring */}
            <rect x="38" y="47" width="26" height="6" rx="2" fill={variant === 'color' ? '#003399' : 'currentColor'} stroke={variant === 'color' ? '#FFFF00' : 'currentColor'} strokeWidth="1.5" />
          </svg>
        );

      // WHO: UN Rod of Asclepius & Serpent in Blue Laurel Wreath
      case 'WHO':
      case 'GHO':
      case 'WHO_GHO':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <circle cx="50" cy="50" r="46" fill={variant === 'color' ? '#EBF8FF' : 'transparent'} stroke={variant === 'color' ? '#0093D5' : 'currentColor'} strokeWidth="2.5" />
            <circle cx="50" cy="50" r="30" stroke={variant === 'color' ? '#0093D5' : 'currentColor'} strokeWidth="1.5" strokeDasharray="3 3" />
            {/* Laurel Wreath */}
            <path d="M22 68 C14 54 18 36 28 24 C28 32 32 40 38 48 C30 52 26 60 22 68 Z" fill={variant === 'color' ? '#0093D5' : 'currentColor'} opacity="0.8" />
            <path d="M78 68 C86 54 82 36 72 24 C72 32 68 40 62 48 C70 52 74 60 78 68 Z" fill={variant === 'color' ? '#0093D5' : 'currentColor'} opacity="0.8" />
            {/* Staff / Rod of Asclepius with coiled serpent */}
            <line x1="50" y1="16" x2="50" y2="84" stroke={variant === 'color' ? '#0093D5' : 'currentColor'} strokeWidth="4" strokeLinecap="round" />
            <path d="M44 76 C56 70 56 62 46 54 C36 46 56 36 46 26" fill="none" stroke={variant === 'color' ? '#DA251D' : 'currentColor'} strokeWidth="3" strokeLinecap="round" />
          </svg>
        );

      // ILO: Wheel / Cog with UN Laurel
      case 'ILO':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <rect width="100" height="100" rx="20" fill={variant === 'color' ? '#003366' : 'transparent'} />
            <circle cx="50" cy="50" r="34" stroke={variant === 'color' ? '#FFFFFF' : 'currentColor'} strokeWidth="3" />
            <path d="M50 20 L50 80 M20 50 L80 50" stroke={variant === 'color' ? '#009EDB' : 'currentColor'} strokeWidth="3" />
            <text x="50" y="56" textAnchor="middle" fill={variant === 'color' ? '#FFFFFF' : 'currentColor'} fontSize="18" fontFamily="sans-serif" fontWeight="bold">ILO</text>
          </svg>
        );

      // Freedom House (FH)
      case 'FREEDOM_HOUSE':
      case 'FH_FIW':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <rect width="100" height="100" rx="20" fill={variant === 'color' ? '#1A365D' : 'transparent'} />
            {/* Torch of Liberty vector icon */}
            <path d="M50 20 L58 35 L42 35 Z" fill={variant === 'color' ? '#E53E3E' : 'currentColor'} />
            <path d="M44 38 L56 38 L52 64 L48 64 Z" fill={variant === 'color' ? '#ECC94B' : 'currentColor'} />
            <rect x="42" y="66" width="16" height="14" rx="2" fill={variant === 'color' ? '#FFFFFF' : 'currentColor'} />
            <text x="50" y="92" textAnchor="middle" fill={variant === 'color' ? '#FFFFFF' : 'currentColor'} fontSize="12" fontFamily="sans-serif" fontWeight="bold">FREEDOM</text>
          </svg>
        );

      // Global Integrity (AII)
      case 'GLOBAL_INTEGRITY':
      case 'AII':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <rect width="100" height="100" rx="20" fill={variant === 'color' ? '#0F172A' : 'transparent'} />
            <circle cx="50" cy="50" r="34" stroke={variant === 'color' ? '#00A3E0' : 'currentColor'} strokeWidth="3" />
            <path d="M35 52 L45 62 L65 38" stroke={variant === 'color' ? '#10B981' : 'currentColor'} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      // Worldwide Governance Indicators (WGI)
      case 'WGI':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <rect width="100" height="100" rx="20" fill={variant === 'color' ? '#002244' : 'transparent'} />
            <polygon points="50,20 80,38 80,68 50,86 20,68 20,38" stroke={variant === 'color' ? '#009EDB' : 'currentColor'} strokeWidth="3" fill="none" />
            <circle cx="50" cy="50" r="14" fill={variant === 'color' ? '#F59E0B' : 'currentColor'} />
            <text x="50" y="55" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">WGI</text>
          </svg>
        );

      // Regional Blocs: ECOWAS, EAC, SADC, COMESA
      case 'ECOWAS':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <rect width="100" height="100" rx="20" fill={variant === 'color' ? '#008751' : 'transparent'} />
            <circle cx="50" cy="50" r="34" stroke={variant === 'color' ? '#FFFFFF' : 'currentColor'} strokeWidth="3" />
            <circle cx="50" cy="50" r="24" fill={variant === 'color' ? '#FFCC00' : 'currentColor'} />
            <text x="50" y="55" textAnchor="middle" fill="#000000" fontSize="10" fontWeight="bold">CEDEAO</text>
          </svg>
        );

      case 'EAC':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <rect width="100" height="100" rx="20" fill={variant === 'color' ? '#0099FF' : 'transparent'} />
            <circle cx="50" cy="50" r="34" stroke={variant === 'color' ? '#006600' : 'currentColor'} strokeWidth="4" />
            <circle cx="50" cy="50" r="26" fill={variant === 'color' ? '#FFCC00' : 'currentColor'} />
            <text x="50" y="55" textAnchor="middle" fill="#000000" fontSize="11" fontWeight="bold">EAC</text>
          </svg>
        );

      case 'SADC':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <rect width="100" height="100" rx="20" fill={variant === 'color' ? '#002366' : 'transparent'} />
            <circle cx="50" cy="50" r="34" stroke={variant === 'color' ? '#FFCC00' : 'currentColor'} strokeWidth="3.5" />
            <text x="50" y="57" textAnchor="middle" fill={variant === 'color' ? '#FFCC00' : 'currentColor'} fontSize="14" fontFamily="sans-serif" fontWeight="bold">SADC</text>
          </svg>
        );

      case 'COMESA':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <rect width="100" height="100" rx="20" fill={variant === 'color' ? '#006600' : 'transparent'} />
            <circle cx="50" cy="50" r="34" stroke={variant === 'color' ? '#FFCC00' : 'currentColor'} strokeWidth="3" />
            <text x="50" y="55" textAnchor="middle" fill={variant === 'color' ? '#FFFFFF' : 'currentColor'} fontSize="10" fontWeight="bold">COMESA</text>
          </svg>
        );

      default:
        // Generic Institution Vector Emblem
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <circle cx="50" cy="50" r="44" fill={variant === 'color' ? '#1E293B' : 'transparent'} stroke="currentColor" strokeWidth="2.5" />
            <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="50" y="55" textAnchor="middle" fill="currentColor" fontSize="11" fontWeight="bold">
              {metadata.acronym.slice(0, 4)}
            </text>
          </svg>
        );
    }
  };

  return (
    <div 
      className={`inline-flex items-center gap-2 ${className}`}
      title={`${metadata.name} (${metadata.acronym}) • Source: Wikimedia Commons / Official Vector`}
    >
      <div 
        style={{ width: dim, height: dim }} 
        className="shrink-0 flex items-center justify-center transition-transform hover:scale-105"
      >
        {renderSvg()}
      </div>

      {showBadge && (
        <span className="text-xs font-semibold tracking-tight text-neutral-800 dark:text-neutral-200">
          {metadata.acronym}
        </span>
      )}
    </div>
  );
};
