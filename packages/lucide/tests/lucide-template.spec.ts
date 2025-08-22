import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createIcons } from '../src/lucide';

// Mock icons for testing
const mockIcons = {
  Circle: [
    ['circle', { cx: '12', cy: '12', r: '10' }],
  ],
  Heart: [
    ['path', { d: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' }],
  ],
  Volume2: [
    ['polygon', { points: '11 5 6 9 2 9 2 15 6 15 11 19 11 5' }],
    ['path', { d: 'm19.07 4.93-1.41 1.41A8.5 8.5 0 0 1 19.5 12a8.5 8.5 0 0 1-1.84 5.66l1.41 1.41A10.5 10.5 0 0 0 21.5 12a10.5 10.5 0 0 0-2.43-6.07z' }],
    ['path', { d: 'm15.54 8.46-1.41 1.41A2.5 2.5 0 0 1 14.5 12a2.5 2.5 0 0 1-.37 2.13l1.41 1.41A4.5 4.5 0 0 0 16.5 12a4.5 4.5 0 0 0-0.96-3.54z' }],
  ],
};

describe('createIcons - Template Element Support', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should replace elements inside template tags', () => {
    document.body.innerHTML = `
      <template id="icon-template">
        <i data-lucide="circle"></i>
      </template>
    `;

    createIcons({ icons: mockIcons });

    const template = document.querySelector('#icon-template') as HTMLTemplateElement;
    const templateContent = template.content;
    const svgElement = templateContent.querySelector('svg');

    expect(svgElement).toBeTruthy();
    expect(svgElement?.getAttribute('data-lucide')).toBe('circle');
    expect(svgElement?.getAttribute('class')).toContain('lucide');
    expect(svgElement?.getAttribute('class')).toContain('lucide-circle');
    expect(svgElement?.querySelector('circle')).toBeTruthy();
  });

  it('should replace multiple elements inside template tags', () => {
    document.body.innerHTML = `
      <template id="multi-icon-template">
        <div>
          <i data-lucide="circle"></i>
          <i data-lucide="heart"></i>
        </div>
      </template>
    `;

    createIcons({ icons: mockIcons });

    const template = document.querySelector('#multi-icon-template') as HTMLTemplateElement;
    const templateContent = template.content;
    const svgElements = templateContent.querySelectorAll('svg');

    expect(svgElements.length).toBe(2);
    
    const circleSvg = templateContent.querySelector('svg[data-lucide="circle"]');
    const heartSvg = templateContent.querySelector('svg[data-lucide="heart"]');

    expect(circleSvg).toBeTruthy();
    expect(heartSvg).toBeTruthy();
    expect(circleSvg?.querySelector('circle')).toBeTruthy();
    expect(heartSvg?.querySelector('path')).toBeTruthy();
  });

  it('should replace elements in multiple template tags', () => {
    document.body.innerHTML = `
      <template id="template1">
        <i data-lucide="circle"></i>
      </template>
      <template id="template2">
        <i data-lucide="heart"></i>
      </template>
    `;

    createIcons({ icons: mockIcons });

    const template1 = document.querySelector('#template1') as HTMLTemplateElement;
    const template2 = document.querySelector('#template2') as HTMLTemplateElement;

    const circleSvg = template1.content.querySelector('svg[data-lucide="circle"]');
    const heartSvg = template2.content.querySelector('svg[data-lucide="heart"]');

    expect(circleSvg).toBeTruthy();
    expect(heartSvg).toBeTruthy();
  });

  it('should replace both regular elements and template elements', () => {
    document.body.innerHTML = `
      <i data-lucide="volume-2" id="regular-icon"></i>
      <template id="template-with-icon">
        <i data-lucide="circle"></i>
      </template>
    `;

    createIcons({ icons: mockIcons });

    // Check regular element was replaced
    const regularSvg = document.querySelector('svg[data-lucide="volume-2"]');
    expect(regularSvg).toBeTruthy();
    expect(regularSvg?.querySelector('polygon')).toBeTruthy();

    // Check template element was replaced
    const template = document.querySelector('#template-with-icon') as HTMLTemplateElement;
    const templateSvg = template.content.querySelector('svg[data-lucide="circle"]');
    expect(templateSvg).toBeTruthy();
    expect(templateSvg?.querySelector('circle')).toBeTruthy();
  });

  it('should handle empty templates gracefully', () => {
    document.body.innerHTML = `
      <template id="empty-template">
      </template>
      <i data-lucide="circle"></i>
    `;

    createIcons({ icons: mockIcons });

    // Should still replace the regular element
    const regularSvg = document.querySelector('svg[data-lucide="circle"]');
    expect(regularSvg).toBeTruthy();
  });

  it('should handle templates with no lucide elements', () => {
    document.body.innerHTML = `
      <template id="no-lucide-template">
        <div>Regular content</div>
        <span>No icons here</span>
      </template>
      <i data-lucide="heart"></i>
    `;

    createIcons({ icons: mockIcons });

    const template = document.querySelector('#no-lucide-template') as HTMLTemplateElement;
    const templateContent = template.content;
    
    // Template content should remain unchanged
    expect(templateContent.querySelector('div')?.textContent).toBe('Regular content');
    expect(templateContent.querySelector('span')?.textContent).toBe('No icons here');
    expect(templateContent.querySelector('svg')).toBeFalsy();

    // Regular element should still be replaced
    const regularSvg = document.querySelector('svg[data-lucide="heart"]');
    expect(regularSvg).toBeTruthy();
  });

  it('should respect custom nameAttr in template elements', () => {
    document.body.innerHTML = `
      <template id="custom-attr-template">
        <i data-custom-icon="circle"></i>
      </template>
    `;

    createIcons({ 
      icons: mockIcons,
      nameAttr: 'data-custom-icon'
    });

    const template = document.querySelector('#custom-attr-template') as HTMLTemplateElement;
    const templateContent = template.content;
    const svgElement = templateContent.querySelector('svg');

    expect(svgElement).toBeTruthy();
    expect(svgElement?.getAttribute('data-custom-icon')).toBe('circle');
    expect(svgElement?.getAttribute('class')).toContain('lucide-circle');
  });

  it('should inherit attributes from template elements', () => {
    document.body.innerHTML = `
      <template id="attrs-template">
        <i data-lucide="circle" class="custom-class" data-test="value"></i>
      </template>
    `;

    createIcons({ icons: mockIcons });

    const template = document.querySelector('#attrs-template') as HTMLTemplateElement;
    const templateContent = template.content;
    const svgElement = templateContent.querySelector('svg');

    expect(svgElement?.getAttribute('data-test')).toBe('value');
    expect(svgElement?.getAttribute('class')).toContain('custom-class');
    expect(svgElement?.getAttribute('class')).toContain('lucide');
    expect(svgElement?.getAttribute('class')).toContain('lucide-circle');
  });

  it('should handle templates with nested elements containing lucide icons', () => {
    document.body.innerHTML = `
      <template id="nested-template">
        <div class="container">
          <div class="icon-wrapper">
            <i data-lucide="heart" class="nested-icon"></i>
          </div>
          <span>Some text</span>
        </div>
      </template>
    `;

    createIcons({ icons: mockIcons });

    const template = document.querySelector('#nested-template') as HTMLTemplateElement;
    const templateContent = template.content;
    const svgElement = templateContent.querySelector('svg');
    const container = templateContent.querySelector('.container');
    const wrapper = templateContent.querySelector('.icon-wrapper');

    expect(svgElement).toBeTruthy();
    expect(svgElement?.getAttribute('data-lucide')).toBe('heart');
    expect(svgElement?.getAttribute('class')).toContain('nested-icon');
    expect(svgElement?.getAttribute('class')).toContain('lucide-heart');
    
    // Verify the structure is preserved
    expect(container).toBeTruthy();
    expect(wrapper).toBeTruthy();
    expect(wrapper?.contains(svgElement)).toBeTruthy();
  });
});