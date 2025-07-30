import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';

/**
 * HeroHeader - Reusable hero section component untuk landing pages
 * Dapat digunakan di berbagai halaman dengan content yang berbeda
 */
const HeroHeader = ({
  title,
  subtitle,
  description,
  primaryButton,
  secondaryButton,
  backgroundGradient = "bg-gradient-to-r from-primary-600 to-primary-800",
  height = "py-32", // Increased default height
  textAlign = "text-center",
  maxWidth = "max-w-8xl", // Increased max width
  className = "",
  children
}) => {
  return (
    <section className={`${backgroundGradient} text-white ${className}`}>
      <div className={`${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 ${height}`}>
        <div className={textAlign}>
          {/* Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-8 leading-tight">
            {title}
          </h1>
          
          {/* Subtitle */}
          {subtitle && (
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-6 text-primary-100">
              {subtitle}
            </h2>
          )}
          
          {/* Description */}
          {description && (
            <p className="text-xl md:text-2xl lg:text-3xl mb-12 text-primary-100 max-w-5xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
          
          {/* Action Buttons */}
          {(primaryButton || secondaryButton) && (
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {primaryButton && (
                <Link to={primaryButton.href || '#'}>
                  <Button 
                    size="xl" 
                    variant={primaryButton.variant || "secondary"}
                    className={`px-12 py-4 text-lg font-semibold ${primaryButton.className || ''}`}
                    onClick={primaryButton.onClick}
                  >
                    {primaryButton.text}
                  </Button>
                </Link>
              )}
              
              {secondaryButton && (
                <Link to={secondaryButton.href || '#'}>
                  <Button 
                    size="xl" 
                    variant={secondaryButton.variant || "outline"}
                    className={`px-12 py-4 text-lg font-semibold border-white text-white hover:bg-white hover:text-primary-600 ${secondaryButton.className || ''}`}
                    onClick={secondaryButton.onClick}
                  >
                    {secondaryButton.text}
                  </Button>
                </Link>
              )}
            </div>
          )}
          
          {/* Custom content slot */}
          {children && (
            <div className="mt-12">
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

/**
 * Alternative compact hero for internal pages
 */
export const CompactHero = ({
  title,
  description,
  breadcrumb,
  backgroundGradient = "bg-gradient-to-r from-gray-800 to-gray-900",
  className = ""
}) => {
  return (
    <section className={`${backgroundGradient} text-white ${className}`}>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-20">
        <div className="text-center">
          {/* Breadcrumb */}
          {breadcrumb && (
            <nav className="flex justify-center mb-4">
              <ol className="flex items-center space-x-2 text-sm text-gray-300">
                {breadcrumb.map((item, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && <span className="mx-2">/</span>}
                    {item.href ? (
                      <Link to={item.href} className="hover:text-white">
                        {item.text}
                      </Link>
                    ) : (
                      <span className="text-white">{item.text}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          
          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {title}
          </h1>
          
          {/* Description */}
          {description && (
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroHeader;
