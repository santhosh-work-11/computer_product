import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Cpu, Server, HardDrive, Zap, Trash2, ShieldAlert, Plus, Check, ShoppingCart, Award, Monitor, Keyboard, Mouse } from 'lucide-react';
import { isStaticDemo, mockAPI } from '../utils/apiFallback';

const PCBuilder = () => {
  const { addToCart } = useCart();
  
  // Available parts list from database
  const [allParts, setAllParts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected build components state
  const [build, setBuild] = useState({
    cpu: null,
    motherboard: null,
    ram: null,
    ssd: null,
    hdd: null,
    gpu: null,
    psu: null,
    case: null,
    cooler: null,
    monitor: null,
    keyboard: null,
    mouse: null
  });

  // Modal selector state
  const [activeSlot, setActiveSlot] = useState(null); // cpu, motherboard, etc.
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch parts catalog on load
  useEffect(() => {
    const fetchParts = async () => {
      try {
        let partsOnly = [];
        if (isStaticDemo) {
          const data = mockAPI.getProducts();
          partsOnly = data.filter(p => p.type === 'part');
        } else {
          const res = await fetch('/api/products');
          if (res.ok) {
            const data = await res.json();
            partsOnly = data.filter(p => p.type === 'part');
          }
        }
        
        // Seed additional builder specific parts if catalog is small
        const enhancedParts = [...partsOnly];

          
          const extraSeeds = [
            { id: 100, name: 'ASUS ROG Crosshair X670E Hero', price: 649.99, discount_price: null, stock_status: 'in-stock', rating: 4.85, type: 'part', specifications: { Socket: 'AM5', Chipset: 'X670E', MemoryType: 'DDR5', FormFactor: 'ATX' }, power_usage: 50, image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600', category_id: 6 },
            { id: 101, name: 'MSI MPG Z790 Carbon WiFi', price: 349.99, discount_price: null, stock_status: 'in-stock', rating: 4.75, type: 'part', specifications: { Socket: 'LGA1700', Chipset: 'Z790', MemoryType: 'DDR5', FormFactor: 'ATX' }, power_usage: 45, image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600', category_id: 6 },
            { id: 102, name: 'Corsair Vengeance RGB 32GB DDR5 6000MHz', price: 119.99, discount_price: null, stock_status: 'in-stock', rating: 4.9, type: 'part', specifications: { MemoryType: 'DDR5', Capacity: '32GB', Frequency: '6000MHz' }, power_usage: 10, image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600', category_id: 6 },
            { id: 103, name: 'G.Skill Ripjaws V 16GB DDR4 3200MHz', price: 49.99, discount_price: null, stock_status: 'in-stock', rating: 4.8, type: 'part', specifications: { MemoryType: 'DDR4', Capacity: '16GB', Frequency: '3200MHz' }, power_usage: 8, image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600', category_id: 6 },
            { id: 104, name: 'Samsung 990 PRO 2TB NVMe SSD', price: 169.99, discount_price: 159.99, stock_status: 'in-stock', rating: 4.95, type: 'part', specifications: { Interface: 'PCIe 4.0 x4', FormFactor: 'M.2 2280' }, power_usage: 8, image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600', category_id: 6 },
            { id: 105, name: 'Corsair RM1000x 1000W PSU Gold', price: 189.99, discount_price: null, stock_status: 'in-stock', rating: 4.9, type: 'part', specifications: { Wattage: '1000W', Efficiency: '80+ Gold' }, power_usage: 0, image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600', category_id: 6 },
            { id: 106, name: 'Lian Li O11 Dynamic EVO Case', price: 169.99, discount_price: null, stock_status: 'in-stock', rating: 4.92, type: 'part', specifications: { FormFactor: 'ATX Mid Tower', Color: 'Black' }, power_usage: 0, image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600', category_id: 6 },
            { id: 107, name: 'ROG Ryujin III 360 ARGB Cooler', price: 329.99, discount_price: null, stock_status: 'in-stock', rating: 4.88, type: 'part', specifications: { Type: 'AIO Liquid Cooler', FanSize: '360mm' }, power_usage: 25, image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600', category_id: 6 },
            { id: 108, name: 'Seagate BarraCuda 2TB HDD', price: 59.99, discount_price: null, stock_status: 'in-stock', rating: 4.7, type: 'part', specifications: { Type: 'SATA III', Capacity: '2TB', Speed: '7200 RPM' }, power_usage: 10, image_url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=600', category_id: 6 },
            { id: 109, name: 'WD Blue 4TB HDD', price: 99.99, discount_price: 89.99, stock_status: 'in-stock', rating: 4.8, type: 'part', specifications: { Type: 'SATA III', Capacity: '4TB', Speed: '5400 RPM' }, power_usage: 8, image_url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=600', category_id: 6 },
            { id: 110, name: 'ASUS ROG Swift PG27AQDM OLED', price: 899.99, discount_price: 849.99, stock_status: 'in-stock', rating: 4.95, type: 'part', specifications: { Size: '27"', Resolution: '1440p', RefreshRate: '240Hz' }, power_usage: 45, image_url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=600', category_id: 5 },
            { id: 111, name: 'Dell UltraSharp U2723QE 4K', price: 549.99, discount_price: null, stock_status: 'in-stock', rating: 4.8, type: 'part', specifications: { Size: '27"', Resolution: '4K UHD', RefreshRate: '60Hz' }, power_usage: 35, image_url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=600', category_id: 5 },
            { id: 112, name: 'Corsair K100 RGB Mechanical', price: 229.99, discount_price: null, stock_status: 'in-stock', rating: 4.9, type: 'part', specifications: { SwitchType: 'OPX Optical', Layout: 'Full Size' }, power_usage: 5, image_url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=600', category_id: 6 },
            { id: 113, name: 'ASUS ROG Azoth Wireless', price: 249.99, discount_price: 239.99, stock_status: 'in-stock', rating: 4.92, type: 'part', specifications: { SwitchType: 'ROG NX Red', Layout: '75%' }, power_usage: 3, image_url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=600', category_id: 6 },
            { id: 114, name: 'Logitech G502 X Plus Wireless', price: 159.99, discount_price: null, stock_status: 'in-stock', rating: 4.88, type: 'part', specifications: { DPI: '25000', Sensor: 'HERO 25K' }, power_usage: 2, image_url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=600', category_id: 6 },
            { id: 115, name: 'Razer DeathAdder V3 Pro', price: 149.99, discount_price: null, stock_status: 'in-stock', rating: 4.85, type: 'part', specifications: { DPI: '30000', Sensor: 'Focus Pro 30K' }, power_usage: 2, image_url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=600', category_id: 6 }
          ];

          // Merge seeds checking duplicates
          const merged = [...enhancedParts];
          extraSeeds.forEach(seed => {
            if (!merged.some(m => m.id === seed.id || m.name === seed.name)) {
              merged.push(seed);
            }
          });

          setAllParts(merged);
      } catch (err) {
        console.error('Error fetching builder parts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchParts();
  }, []);

  // Builder configurations structure
  const slots = [
    { key: 'cpu', name: 'Processor (CPU)', icon: <Cpu size={24} />, categoryId: 4 },
    { key: 'motherboard', name: 'Motherboard', icon: <Server size={24} />, categoryId: 6 },
    { key: 'ram', name: 'Memory (RAM)', icon: <Cpu size={24} />, categoryId: 6 },
    { key: 'ssd', name: 'Solid State Drive (SSD)', icon: <HardDrive size={24} />, categoryId: 6 },
    { key: 'hdd', name: 'Hard Disk Drive (HDD)', icon: <HardDrive size={24} />, categoryId: 6 },
    { key: 'gpu', name: 'Graphics Card (GPU)', icon: <Zap size={24} />, categoryId: 3 },
    { key: 'cooler', name: 'CPU Cooler', icon: <Cpu size={24} />, categoryId: 6 },
    { key: 'case', name: 'Cabinet (Case)', icon: <Server size={24} />, categoryId: 6 },
    { key: 'psu', name: 'Power Supply (PSU)', icon: <Zap size={24} />, categoryId: 6 },
    { key: 'monitor', name: 'Monitor', icon: <Monitor size={24} />, categoryId: 5 },
    { key: 'keyboard', name: 'Keyboard', icon: <Keyboard size={24} />, categoryId: 6 },
    { key: 'mouse', name: 'Mouse', icon: <Mouse size={24} />, categoryId: 6 }
  ];

  // Helper to resolve product specs
  const getSpecs = (product) => {
    if (!product) return {};
    if (typeof product.specifications === 'string') {
      try { return JSON.parse(product.specifications); } catch (e) { return {}; }
    }
    return product.specifications || {};
  };

  // Compatibility Validations
  const getCompatibilityIssues = () => {
    const issues = [];
    const cpuSpecs = getSpecs(build.cpu);
    const moboSpecs = getSpecs(build.motherboard);
    const ramSpecs = getSpecs(build.ram);

    // 1. CPU vs Motherboard Socket mismatch
    if (build.cpu && build.motherboard) {
      const cpuSocket = cpuSpecs.Socket;
      const moboSocket = moboSpecs.Socket;
      if (cpuSocket && moboSocket && cpuSocket.toUpperCase() !== moboSocket.toUpperCase()) {
        issues.push(`Socket mismatch: Selected ${build.cpu.name} uses Socket ${cpuSocket}, while ${build.motherboard.name} uses Socket ${moboSocket}.`);
      }
    }

    // 2. RAM vs Motherboard RAM Type mismatch
    if (build.ram && build.motherboard) {
      const moboRamType = moboSpecs.MemoryType; // e.g. DDR5 or DDR4
      const ramType = ramSpecs.MemoryType || (build.ram.name.includes('DDR5') ? 'DDR5' : build.ram.name.includes('DDR4') ? 'DDR4' : null);
      if (moboRamType && ramType && moboRamType.toUpperCase() !== ramType.toUpperCase()) {
        issues.push(`RAM Mismatch: Selected Motherboard supports ${moboRamType} memory, while selected RAM is ${ramType}.`);
      }
    }

    // 3. Form Factor (Mobo vs Case) mismatch
    if (build.motherboard && build.case) {
      const moboForm = moboSpecs.FormFactor || 'ATX';
      const caseSpecs = getSpecs(build.case);
      const caseForm = caseSpecs.FormFactor || '';
      if (moboForm === 'ATX' && caseForm.includes('Mini-ITX')) {
        issues.push(`Cabinet Form Factor Conflict: Selected Motherboard is ATX, which cannot fit inside a Mini-ITX Cabinet.`);
      }
    }

    // 4. PSU capacity vs Total power draw
    const totalPower = getEstimatedPower();
    if (build.psu) {
      const psuSpecs = getSpecs(build.psu);
      const psuWattsStr = psuSpecs.Wattage || (build.psu.name.match(/(\d+)W/i)?.[1]);
      const psuWatts = psuWattsStr ? parseInt(psuWattsStr) : 0;
      
      if (psuWatts > 0 && totalPower > psuWatts) {
        issues.push(`Insufficient Power: Your system estimated draw is ${totalPower}W, but the selected PSU is only rated at ${psuWatts}W. We recommend a headroom buffer of at least 150W.`);
      }
    }

    return issues;
  };

  // Calculations
  const getEstimatedPower = () => {
    let power = 0;
    Object.values(build).forEach(item => {
      if (item) {
        power += parseInt(item.power_usage || 0);
      }
    });
    // Add baseline overhead for motherboard chipset, fans, and accessories
    if (build.cpu || build.motherboard) {
      power += 50; 
    }
    return power;
  };

  const getBuildTotalPrice = () => {
    return Object.values(build).reduce((acc, item) => {
      if (item) {
        const itemPrice = item.discount_price !== null ? item.discount_price : item.price;
        return acc + itemPrice;
      }
      return acc;
    }, 0);
  };

  // Performance Score metric (1 - 100)
  const getPerformanceScore = () => {
    let cpuRating = 0;
    let gpuRating = 0;
    let ramRating = 0;

    if (build.cpu) {
      cpuRating = build.cpu.name.includes('i9') || build.cpu.name.includes('Ryzen 9') || build.cpu.name.includes('7800X3D') ? 95 : 70;
    }
    if (build.gpu) {
      gpuRating = build.gpu.name.includes('4090') ? 100 : build.gpu.name.includes('4080') || build.gpu.name.includes('7900') ? 85 : 60;
    }
    if (build.ram) {
      ramRating = build.ram.name.includes('DDR5') ? 90 : 65;
    }

    if (!build.cpu && !build.gpu && !build.ram) return 0;
    
    // Average score weights
    const scores = [cpuRating, gpuRating, ramRating].filter(s => s > 0);
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  // Add build items to general shopping cart
  const handleAddAllToCart = () => {
    const selectedItems = Object.values(build).filter(Boolean);
    if (selectedItems.length === 0) {
      alert('Your build configuration is empty. Select components to add to cart!');
      return;
    }

    selectedItems.forEach(item => {
      addToCart(item, 1);
    });

    alert(`Successfully added ${selectedItems.length} components to your shopping cart!`);
  };

  // Filtering select options inside modal popup
  const getModalOptions = () => {
    if (!activeSlot) return [];
    const slotInfo = slots.find(s => s.key === activeSlot);
    
    // Filter parts by name matching active categories
    let filtered = allParts;
    if (activeSlot === 'cpu') {
      filtered = allParts.filter(p => p.name.includes('Core') || p.name.includes('Ryzen') || p.name.includes('Intel') || p.name.includes('AMD'));
    } else if (activeSlot === 'motherboard') {
      filtered = allParts.filter(p => p.name.includes('Motherboard') || p.name.includes('ROG Crosshair') || p.name.includes('Z790') || p.name.includes('X670'));
    } else if (activeSlot === 'ram') {
      filtered = allParts.filter(p => p.name.includes('RAM') || p.name.includes('Vengeance') || p.name.includes('Ripjaws') || p.name.includes('DDR'));
    } else if (activeSlot === 'ssd') {
      filtered = allParts.filter(p => p.name.includes('SSD') || p.name.includes('NVMe') || p.name.includes('Storage'));
    } else if (activeSlot === 'hdd') {
      filtered = allParts.filter(p => p.name.includes('HDD') || p.name.includes('BarraCuda') || p.name.includes('WD Blue') || p.name.includes('Hard Drive'));
    } else if (activeSlot === 'gpu') {
      filtered = allParts.filter(p => p.name.includes('GeForce') || p.name.includes('Radeon') || p.name.includes('RTX') || p.name.includes('GPU'));
    } else if (activeSlot === 'psu') {
      filtered = allParts.filter(p => p.name.includes('Power Supply') || p.name.includes('PSU') || p.name.includes('RM1000x'));
    } else if (activeSlot === 'cooler') {
      filtered = allParts.filter(p => p.name.includes('Cooler') || p.name.includes('Liquid') || p.name.includes('Ryujin'));
    } else if (activeSlot === 'case') {
      filtered = allParts.filter(p => p.name.includes('Case') || p.name.includes('Cabinet') || p.name.includes('Dynamic EVO'));
    } else if (activeSlot === 'monitor') {
      filtered = allParts.filter(p => p.name.includes('Monitor') || p.name.includes('ROG Swift') || p.name.includes('UltraSharp') || p.name.includes('Display'));
    } else if (activeSlot === 'keyboard') {
      filtered = allParts.filter(p => p.name.includes('Keyboard') || p.name.includes('K100') || p.name.includes('Azoth') || p.name.includes('Mechanical'));
    } else if (activeSlot === 'mouse') {
      filtered = allParts.filter(p => p.name.includes('Mouse') || p.name.includes('G502') || p.name.includes('DeathAdder') || p.name.includes('Wireless Mouse'));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q));
    }

    return filtered;
  };

  const compIssues = getCompatibilityIssues();
  const estimatedPower = getEstimatedPower();
  const totalPrice = getBuildTotalPrice();
  const perfScore = getPerformanceScore();

  return (
    <div className="section-container builder-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px' }}>
      
      {/* Slots List Container */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Custom PC Part Picker</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Select performance-matched components for your custom desktop rig.</p>
        </div>

        {/* Dynamic warning bar if issues found */}
        {compIssues.length > 0 && (
          <div className="glass-panel" style={{
            background: 'rgba(239, 68, 68, 0.1)',
            borderColor: '#ef4444',
            padding: '16px 20px',
            borderRadius: '12px',
            color: '#ef4444',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
              <ShieldAlert size={20} />
              <span>Compatibility Conflicts Detected</span>
            </div>
            <ul style={{ fontSize: '13px', paddingLeft: '24px' }}>
              {compIssues.map((issue, idx) => <li key={idx}>{issue}</li>)}
            </ul>
          </div>
        )}

        {/* Map Builder Slots */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {slots.map((slot) => {
            const selectedItem = build[slot.key];
            const itemPrice = selectedItem ? (selectedItem.discount_price !== null ? selectedItem.discount_price : selectedItem.price) : 0;
            const itemSpecs = getSpecs(selectedItem);

            return (
              <div key={slot.key} className="glass-panel" style={{
                display: 'grid',
                gridTemplateColumns: '50px 1fr auto',
                alignItems: 'center',
                padding: '16px 24px',
                gap: '20px',
                minHeight: '80px',
                borderColor: selectedItem ? 'var(--accent-glow)' : 'var(--border-color)'
              }}>
                <div style={{
                  color: selectedItem ? 'var(--accent-primary)' : 'var(--text-muted)',
                  background: 'var(--bg-tertiary)',
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {slot.icon}
                </div>

                <div>
                  <h4 style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{slot.name}</h4>
                  {selectedItem ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontWeight: 600, fontSize: '15px' }}>{selectedItem.name}</span>
                      {Object.keys(itemSpecs).length > 0 && (
                        <span style={{ fontSize: '11px', color: 'var(--accent-primary)' }}>
                          {itemSpecs.Socket ? `Socket ${itemSpecs.Socket}` : ''}
                          {itemSpecs.MemoryType ? ` | Supports ${itemSpecs.MemoryType}` : ''}
                          {itemSpecs.Wattage ? ` | Wattage: ${itemSpecs.Wattage}` : ''}
                          {selectedItem.power_usage ? ` | Power Draw: ${selectedItem.power_usage}W` : ''}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontStyle: 'italic' }}>No part selected</span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  {selectedItem && (
                    <span style={{ fontWeight: 700, fontSize: '16px' }}>${itemPrice.toFixed(2)}</span>
                  )}
                  {selectedItem ? (
                    <button
                      onClick={() => setBuild(prev => ({ ...prev, [slot.key]: null }))}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--accent-secondary)',
                        cursor: 'pointer',
                        padding: '6px'
                      }}
                      title="Remove Part"
                    >
                      <Trash2 size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveSlot(slot.key);
                        setSearchQuery('');
                      }}
                      className="btn-primary"
                      style={{ padding: '8px 14px', fontSize: '12px', gap: '4px', borderRadius: '8px' }}
                    >
                      <Plus size={14} /> Add component
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sidebar Metrics Summary Panel */}
      <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px', position: 'sticky', top: '90px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3>Build Summary</h3>
          <hr style={{ border: 0, borderTop: '1px solid var(--border-color)' }} />

          {/* Pricing */}
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Estimated Subtotal</span>
            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)' }}>
              ${totalPrice.toFixed(2)}
            </div>
          </div>

          {/* Estimated Power Draw */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
              <span>Power Usage</span>
              <span style={{ fontWeight: 'bold' }}>{estimatedPower}W</span>
            </div>
            <div style={{ background: 'var(--bg-tertiary)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                background: estimatedPower > 650 ? '#ef4444' : 'var(--accent-primary)',
                width: `${Math.min(100, (estimatedPower / 1000) * 100)}%`,
                height: '100%',
                transition: 'var(--transition-smooth)'
              }} />
            </div>
          </div>

          {/* Performance Estimate Indicator */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
              <span>Performance Tier</span>
              <span style={{ fontWeight: 'bold', color: 'var(--accent-secondary)' }}>{perfScore}%</span>
            </div>
            <div style={{ background: 'var(--bg-tertiary)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                background: 'linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                width: `${perfScore}%`,
                height: '100%',
                transition: 'var(--transition-smooth)'
              }} />
            </div>
          </div>

          <hr style={{ border: 0, borderTop: '1px solid var(--border-color)' }} />

          {/* Action CTAs */}
          <button
            onClick={handleAddAllToCart}
            disabled={Object.values(build).filter(Boolean).length === 0}
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              background: Object.values(build).filter(Boolean).length === 0 ? 'var(--text-muted)' : undefined,
              cursor: Object.values(build).filter(Boolean).length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <ShoppingCart size={18} /> Add Rig to Cart
          </button>
          
          <button
            onClick={() => setBuild({
              cpu: null, motherboard: null, ram: null, ssd: null, hdd: null, gpu: null, psu: null, case: null, cooler: null, monitor: null, keyboard: null, mouse: null
            })}
            disabled={Object.values(build).filter(Boolean).length === 0}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Clear Configuration
          </button>
        </div>
      </aside>

      {/* Component Selector Popup Modal */}
      {activeSlot && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(11, 15, 25, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000,
          padding: '20px'
        }} onClick={() => setActiveSlot(null)}>
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '650px',
              maxHeight: '80vh',
              background: 'var(--bg-secondary)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ textTransform: 'capitalize' }}>Select {activeSlot}</h3>
              <button
                onClick={() => setActiveSlot(null)}
                style={{ background: 'transparent', border: 0, color: 'var(--text-primary)', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>

            {/* Keyword Search */}
            <input
              type="text"
              placeholder="Search component name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input"
              style={{ width: '100%' }}
            />

            {/* Render items list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {loading ? (
                <span>Loading catalog parts...</span>
              ) : getModalOptions().length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No compatible parts found matching search term.
                </div>
              ) : (
                getModalOptions().map((part) => {
                  const partSpecs = getSpecs(part);
                  return (
                    <div
                      key={part.id}
                      style={{
                        padding: '12px 16px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'var(--transition-smooth)',
                        background: 'var(--bg-primary)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                      onClick={() => {
                        setBuild(prev => ({ ...prev, [activeSlot]: part }));
                        setActiveSlot(null);
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontWeight: 600, fontSize: '14px' }}>{part.name}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {partSpecs.Socket ? `Socket ${partSpecs.Socket}` : ''}
                          {partSpecs.MemoryType ? ` | RAM: ${partSpecs.MemoryType}` : ''}
                          {partSpecs.Wattage ? ` | PSU: ${partSpecs.Wattage}` : ''}
                          {part.power_usage ? ` | Power: ${part.power_usage}W` : ''}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontWeight: 700, fontSize: '15px' }}>
                          ${(part.discount_price || part.price).toFixed(2)}
                        </span>
                        <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px', gap: 0 }}>
                          Select
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Responsive Inline CSS */}
      <style>{`
        @media (max-width: 992px) {
          .builder-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PCBuilder;
