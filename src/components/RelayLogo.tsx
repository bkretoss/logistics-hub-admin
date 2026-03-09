const RelayLogo = () => (
  <svg width="48" height="48" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer circle - dark border */}
    <circle cx="100" cy="100" r="95" fill="#2C3E50" />
    
    {/* Yellow ring with text */}
    <circle cx="100" cy="100" r="88" fill="#FDB913" />
    
    {/* Red middle ring */}
    <circle cx="100" cy="100" r="70" fill="#DC3545" />
    
    {/* Inner yellow circle */}
    <circle cx="100" cy="100" r="62" fill="#FDB913" />
    
    {/* RL Text */}
    <text x="100" y="95" fontSize="48" fontWeight="900" fill="#2C3E50" textAnchor="middle" fontFamily="Arial, sans-serif">RL</text>
    
    {/* Eagle wings - simplified */}
    <path d="M 70 115 Q 60 120 50 115 L 55 110 Q 65 115 70 110 Z" fill="#2C3E50" />
    <path d="M 130 115 Q 140 120 150 115 L 145 110 Q 135 115 130 110 Z" fill="#2C3E50" />
    
    {/* Top arc text - RELAY LOGISTICS */}
    <path id="topArc" d="M 30 100 A 70 70 0 0 1 170 100" fill="none" />
    <text fontSize="14" fontWeight="700" fill="#FDB913" fontFamily="Arial, sans-serif">
      <textPath href="#topArc" startOffset="50%" textAnchor="middle">
        RELAY LOGISTICS
      </textPath>
    </text>
    
    {/* Bottom arc text - INSPIRE EXCELLENCE */}
    <path id="bottomArc" d="M 170 100 A 70 70 0 0 1 30 100" fill="none" />
    <text fontSize="12" fontWeight="700" fill="#FDB913" fontFamily="Arial, sans-serif">
      <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
        INSPIRE EXCELLENCE
      </textPath>
    </text>
  </svg>
);

export default RelayLogo;
