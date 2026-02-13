from playwright.sync_api import sync_playwright
from datetime import datetime
import os

VIEWPORTS = [
    {'name': 'mobile-xs', 'width': 320, 'height': 568},
    {'name': 'mobile-sm', 'width': 375, 'height': 667},
    {'name': 'mobile-lg', 'width': 414, 'height': 896},
    {'name': 'tablet-portrait', 'width': 768, 'height': 1024},
    {'name': 'tablet-landscape', 'width': 1024, 'height': 768},
    {'name': 'desktop-sm', 'width': 1280, 'height': 720},
    {'name': 'desktop-md', 'width': 1440, 'height': 900},
    {'name': 'desktop-lg', 'width': 1920, 'height': 1080},
    {'name': 'ultra-wide', 'width': 2560, 'height': 1440},
]

OUTPUT_DIR = 'tests/screenshots'
TIMESTAMP = datetime.now().strftime('%Y%m%d_%H%M%S')

def test_responsive_layouts():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        for viewport in VIEWPORTS:
            print(f'\nTesting viewport: {viewport["name"]} ({viewport["width"]}x{viewport["height"]})')
            
            context = browser.new_context(viewport={'width': viewport['width'], 'height': viewport['height']})
            page = context.new_page()
            
            page.goto('http://localhost:3000')
            page.wait_for_load_state('networkidle')
            
            viewport_dir = f'{OUTPUT_DIR}/{TIMESTAMP}/{viewport["name"]}'
            os.makedirs(viewport_dir, exist_ok=True)
            
            page.screenshot(path=f'{viewport_dir}/01_homepage.png', full_page=True)
            
            test_mobile_menu(page, viewport, viewport_dir)
            
            test_faq_accordion(page, viewport, viewport_dir)
            
            test_sticky_cta(page, viewport, viewport_dir)
            
            test_navigation_scroll(page, viewport, viewport_dir)
            
            context.close()
        
        browser.close()
        print(f'\nAll screenshots saved to: {OUTPUT_DIR}/{TIMESTAMP}')

def test_mobile_menu(page, viewport, output_dir):
    if viewport['width'] <= 768:
        mobile_toggle = page.locator('.mobile-toggle')
        
        if mobile_toggle.count() > 0:
            mobile_toggle.click()
            page.wait_for_timeout(500)
            page.screenshot(path=f'{output_dir}/02_mobile_menu_open.png')
            
            backdrop = page.locator('.backdrop-overlay')
            if backdrop.count() > 0:
                backdrop.click()
                page.wait_for_timeout(500)
                page.screenshot(path=f'{output_dir}/03_mobile_menu_closed.png')

def test_faq_accordion(page, viewport, output_dir):
    faq_section = page.locator('#about')
    
    try:
        faq_section.scroll_into_view_if_needed()
        page.wait_for_timeout(500)
        page.screenshot(path=f'{output_dir}/04_faq_before_expand.png')
        
        faq_tabs = page.locator('.faq-tab-button')
        if faq_tabs.count() > 0:
            faq_tabs.first.click()
            page.wait_for_timeout(300)
            
            faq_items = page.locator('.faq-item').first
            faq_items.click()
            page.wait_for_timeout(300)
            page.screenshot(path=f'{output_dir}/05_faq_expanded.png')
    except:
        pass

def test_sticky_cta(page, viewport, output_dir):
    if viewport['width'] <= 768:
        page.evaluate('window.scrollTo(0, 400)')
        page.wait_for_timeout(500)
        page.screenshot(path=f'{output_dir}/06_sticky_cta_mobile.png')
    else:
        page.evaluate('window.scrollTo(0, 400)')
        page.wait_for_timeout(500)
        page.screenshot(path=f'{output_dir}/06_sticky_cta_desktop.png')
        
        cta_hover = page.locator('.sticky-cta-transformable')
        if cta_hover.count() > 0:
            cta_hover.hover()
            page.wait_for_timeout(300)
            page.screenshot(path=f'{output_dir}/07_sticky_cta_hover.png')

def test_navigation_scroll(page, viewport, output_dir):
    page.evaluate('window.scrollTo(0, 0)')
    page.wait_for_timeout(300)
    
    sections = ['experience', 'products', 'contact']
    for section in sections:
        page.evaluate(f'document.querySelector("#{section}")?.scrollIntoView({{"behavior": "smooth", "block": "start"}})')
        page.wait_for_timeout(800)
        page.screenshot(path=f'{output_dir}/08_nav_{section}.png')
        page.evaluate('window.scrollTo(0, 0)')
        page.wait_for_timeout(300)

if __name__ == '__main__':
    test_responsive_layouts()
