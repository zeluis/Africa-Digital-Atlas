import React from 'react';

export interface ProvenanceShieldProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  as?: 'span' | 'div' | 'code' | 'strong' | 'p';
  variant?: 'author' | 'institution' | 'doi' | 'iso' | 'genetic' | 'hash' | 'general';
}

/**
 * High-precision research provenance shield.
 * Prevents machine translation algorithms (Google Translate, Chrome, Safari, Edge)
 * from modifying proper nouns, scholarly authors, institutional acronyms, DOIs,
 * genetic haplogroups, and ISO classifications.
 */
export const ProvenanceShield: React.FC<ProvenanceShieldProps> = ({
  children,
  as: Component = 'span',
  variant = 'general',
  className = '',
  ...props
}) => {
  return (
    <Component
      translate="no"
      className={`notranslate ${className}`}
      data-provenance-type={variant}
      {...props}
    >
      {children}
    </Component>
  );
};

export default ProvenanceShield;
