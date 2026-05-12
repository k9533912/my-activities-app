import React, { useState } from 'react';
import { categories, getCategoryData } from './data/mockData';
import * as Icons from 'lucide-react';
import './App.css';

function App() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeTab, setActiveTab] = useState('최근기사');

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    setActiveTab('최근기사');
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const renderIcon = (iconName, color) => {
    const IconComponent = Icons[iconName] || Icons.HelpCircle;
    return <IconComponent size={48} color={color} strokeWidth={1.5} />;
  };

  const activeCategoryData = activeCategory ? getCategoryData(activeCategory) : null;
  const activeCategoryInfo = activeCategory ? categories.find(c => c.id === activeCategory) : null;

  return (
    <div className="app-container">
      <header className="hero-section glass-panel">
        <h1 className="main-title">나의 소소한 활동들</h1>
        <p className="subtitle">기록하고, 나누고, 성장하는 매일의 발자취</p>
        <div className="visitor-stats" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
          <span className="stat-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.8)', padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.9rem', fontWeight: '600', color: '#3b82f6', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}><Icons.Users size={16} /> 누적 방문자: 12,458명</span>
          <span className="stat-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.8)', padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.9rem', fontWeight: '600', color: '#10b981', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}><Icons.UserCheck size={16} /> 오늘 방문자: 142명</span>
        </div>
      </header>

      <main className="main-content">
        <section className="category-grid">
          {categories.map((category, index) => (
            <div 
              key={category.id}
              className={`category-card glass-panel animate-fade-in ${activeCategory === category.id ? 'active' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="icon-wrapper" style={{ backgroundColor: `${category.color}15` }}>
                {renderIcon(category.icon, category.color)}
              </div>
              <h2>{category.name}</h2>
            </div>
          ))}
        </section>

        {activeCategoryInfo && activeCategoryData && (
          <section className="detail-section glass-panel animate-fade-in">
            <div className="detail-header" style={{ borderBottomColor: activeCategoryInfo.color }}>
              <div className="detail-title-wrapper">
                {renderIcon(activeCategoryInfo.icon, activeCategoryInfo.color)}
                <h2>{activeCategoryInfo.name} 활동 내역</h2>
              </div>
              <div className="tabs">
                {['최근기사', '논문(연구보고서)', '발표자료'].map(tab => (
                  <button
                    key={tab}
                    className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                    style={activeTab === tab ? { backgroundColor: activeCategoryInfo.color, color: 'white', borderColor: activeCategoryInfo.color } : {}}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="content-grid">
              {/* 최근 등록된 */}
              <div className="data-column">
                <div className="column-header">
                  <Icons.Clock size={20} />
                  <h3>가장 최근 자료</h3>
                </div>
                <div className="item-list">
                  {activeCategoryData[activeTab].recent.map(item => (
                    <div key={item.id} className="data-item">
                      <h4>
                        <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {item.title} <Icons.ExternalLink size={14} color="#94a3b8" />
                        </a>
                      </h4>
                      <p className="summary">{item.summary}</p>
                      <div className="item-meta-footer" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                        <span className="meta date" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Calendar size={12} /> {item.date}</span>
                        <span className="meta views" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Eye size={12} /> 조회 {item.views}</span>
                        <span className="meta visitors" style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#e0e7ff', color: '#4338ca', fontSize: '0.8rem', fontWeight: '600', padding: '0.25rem 0.75rem', borderRadius: '999px' }}><Icons.User size={12} /> 방문 {item.visitors || Math.floor(Math.random() * 500) + 50}</span>
                        <span className="meta citations" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Quote size={12} /> 인용 {item.citations}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 조회수 높은 */}
              <div className="data-column">
                <div className="column-header">
                  <Icons.Eye size={20} />
                  <h3>가장 조회수가 높은 자료</h3>
                </div>
                <div className="item-list">
                  {activeCategoryData[activeTab].popular.map(item => (
                    <div key={item.id} className="data-item">
                      <h4>
                        <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {item.title} <Icons.ExternalLink size={14} color="#94a3b8" />
                        </a>
                      </h4>
                      <p className="summary">{item.summary}</p>
                      <div className="item-meta-footer" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                        <span className="meta date" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Calendar size={12} /> {item.date}</span>
                        <span className="meta views" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Eye size={12} /> 조회 {item.views}</span>
                        <span className="meta visitors" style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#e0e7ff', color: '#4338ca', fontSize: '0.8rem', fontWeight: '600', padding: '0.25rem 0.75rem', borderRadius: '999px' }}><Icons.User size={12} /> 방문 {item.visitors || Math.floor(Math.random() * 500) + 50}</span>
                        <span className="meta citations" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Quote size={12} /> 인용 {item.citations}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 많이 인용된 */}
              <div className="data-column">
                <div className="column-header">
                  <Icons.Quote size={20} />
                  <h3>가장 많이 인용된 자료</h3>
                </div>
                <div className="item-list">
                  {activeCategoryData[activeTab].cited.map(item => (
                    <div key={item.id} className="data-item">
                      <h4>
                        <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {item.title} <Icons.ExternalLink size={14} color="#94a3b8" />
                        </a>
                      </h4>
                      <p className="summary">{item.summary}</p>
                      <div className="item-meta-footer" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                        <span className="meta date" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Calendar size={12} /> {item.date}</span>
                        <span className="meta views" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Eye size={12} /> 조회 {item.views}</span>
                        <span className="meta visitors" style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#e0e7ff', color: '#4338ca', fontSize: '0.8rem', fontWeight: '600', padding: '0.25rem 0.75rem', borderRadius: '999px' }}><Icons.User size={12} /> 방문 {item.visitors || Math.floor(Math.random() * 500) + 50}</span>
                        <span className="meta citations" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Quote size={12} /> 인용 {item.citations}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      
      <footer className="app-footer">
        <p>※ 매주 월요일, 새로운 활동 내용이 자동으로 업데이트됩니다.</p>
      </footer>
    </div>
  );
}

export default App;
