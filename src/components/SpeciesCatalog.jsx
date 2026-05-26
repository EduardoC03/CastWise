import React from 'react';
import { Fish, Search } from 'lucide-react';

export default function SpeciesCatalog() {
  return (
    <div className="cw-screen cw-catalog">
      <div className="cw-catalog-head">
        <h2 className="cw-catalog-title">Species Catalog</h2>
        <p className="cw-catalog-subtitle">Browse Washington fish species</p>
      </div>
      
      <div className="cw-search mb-4">
        <Search size={13}/>
        <input placeholder="Search species…"/>
      </div>

      <div className="cw-placeholder-content">
        <Fish size={48} className="cw-icon-fade" />
        <p>Species catalog coming soon.</p>
      </div>
    </div>
  );
}
