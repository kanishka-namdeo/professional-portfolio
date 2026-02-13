from playwright.sync_api import sync_playwright, Page, Browser
from typing import List, Dict, Any
import json
from pathlib import Path

# Viewport configurations for comprehensive testing
VIEWPORTS = {
    'mobile_small': {'width': 320, 'height': 568, 'category': 'mobile', 'device': 'iPhone 5'},
    'mobile_medium': {'width': 375, 'height': 667, 'category': 'mobile', 'device': 'iPhone 8'},
    'mobile_large': {'width': 414, 'height': 896, 'category': 'mobile', 'device': 'iPhone 11'},
    'mobile_extra': {'width': 480, 'height': 800, 'category': 'mobile', 'device': 'Large Mobile'},
    'tablet_small': {'width': 768, 'height': 1024, 'category': 'tablet', 'device': 'iPad'},
    'tablet_medium': {'width': 820, 'height': 1180, 'category': 'tablet', 'device': 'iPad Pro 11"'},
    'tablet_large': {'width': 1024, 'height': 1366, 'category': 'tablet', 'device': 'iPad Pro 12.9"'},
    'desktop_small': {'width': 1280, 'height': 720, 'category': 'desktop', 'device': 'Small Desktop'},
    'desktop_standard': {'width': 1440, 'height': 900, 'category': 'desktop', 'device': 'Standard Desktop'},
    'desktop_large': {'width': 1920, 'height': 1080, 'category': 'desktop', 'device': 'Large Desktop (FHD)'},
    'ultra_wide': {'width': 2560, 'height': 1440, 'category': 'ultra-wide', 'device': '2K Display'},
    'ultra_wide_xl': {'width': 3840, 'height': 2160, 'category': 'ultra-wide', 'device': '4K Display'}
}

# Test results storage
test_results = {
    'timestamp': None,
    'summary': {'total_tests': 0, 'passed': 0, 'failed': 0, 'warnings': 0},
    'viewport_results': {},
    'issues': []
}

def log_test(viewport_name: str, test_name: str, status: str, details: str = None):
    """Log a test result"""
    key = f'{viewport_name}.{test_name}'
    if viewport_name not in test_results['viewport_results']:
        test_results['viewport_results'][viewport_name] = {}
    
    test_results['viewport_results'][viewport_name][test_name] = {
        'status': status,
        'details': details or ''
    }
    
    test_results['summary']['total_tests'] += 1
    if status == 'PASS':
        test_results['summary']['passed'] += 1
    elif status == 'FAIL':
        test_results['summary']['failed'] += 1
        test_results['issues'].append(f'[{viewport_name}] {test_name}: {details}')
    elif status == 'WARN':
        test_results['summary']['warnings'] += 1
        test_results['issues'].append(f'[{viewport_name}] {test_name}: {details}')
    
    icon = '✓' if status == 'PASS' else '✗' if status == 'FAIL' else '⚠'
    print(f'  {icon} {test_name}: {status}')
    if details:
        print(f'     {details}')

def take_screenshot(page: Page, name: str, viewport: Dict[str, Any]):
    """Take a screenshot with descriptive name"""
    output_dir = Path('.trae/skills/webapp-testing/screenshots')
    output_dir.mkdir(parents=True, exist_ok=True)
    filename = f'{name}_{viewport["width"]}x{viewport["height"]}.png'
    filepath = output_dir / filename
    page.screenshot(path=str(filepath), full_page=True)
    print(f'  📸 Screenshot saved: {filename}')

def test_navigation(page: Page, viewport_name: str, viewport: Dict[str, Any]) -> bool:
    """Test navigation component across different viewports"""
    print(f'\n  Testing Navigation...')
    
    is_mobile = viewport['category'] in ['mobile', 'tablet']
    
    # Check if nav container exists
    nav = page.locator('.nav-container')
    if not nav.count() > 0:
        log_test(viewport_name, 'Navigation container exists', 'FAIL', 'Navigation container not found')
        return False
    log_test(viewport_name, 'Navigation container exists', 'PASS')
    
    # Test desktop navigation
    if not is_mobile:
        desktop_nav = page.locator('.nav-links-desktop')
        if not desktop_nav.count() > 0:
            log_test(viewport_name, 'Desktop nav links visible', 'FAIL', 'Desktop nav not visible on desktop')
        else:
            log_test(viewport_name, 'Desktop nav links visible', 'PASS')
            # Check nav links
            nav_links = desktop_nav.locator('.nav-link')
            link_count = nav_links.count()
            if link_count == 3:
                log_test(viewport_name, 'Desktop nav has 3 links', 'PASS')
            else:
                log_test(viewport_name, 'Desktop nav has 3 links', 'WARN', f'Found {link_count} links, expected 3')
    else:
        # Mobile navigation
        desktop_nav = page.locator('.nav-links-desktop')
        if desktop_nav.count() > 0 and desktop_nav.is_visible():
            log_test(viewport_name, 'Desktop nav hidden on mobile', 'FAIL', 'Desktop nav visible on mobile')
        else:
            log_test(viewport_name, 'Desktop nav hidden on mobile', 'PASS')
        
        # Check mobile toggle exists
        mobile_toggle = page.locator('#mobileToggle')
        if not mobile_toggle.count() > 0:
            log_test(viewport_name, 'Mobile toggle exists', 'FAIL', 'Mobile toggle not found')
        else:
            log_test(viewport_name, 'Mobile toggle exists', 'PASS')
            
            # Test mobile menu toggle
            if mobile_toggle.is_visible():
                mobile_toggle.click()
                page.wait_for_timeout(300)
                
                mobile_nav = page.locator('.mobile-nav.active')
                if mobile_nav.count() > 0:
                    log_test(viewport_name, 'Mobile menu opens on toggle', 'PASS')
                    
                    # Check mobile nav links
                    mobile_links = mobile_nav.locator('.nav-link')
                    if mobile_links.count() == 3:
                        log_test(viewport_name, 'Mobile nav has 3 links', 'PASS')
                    else:
                        log_test(viewport_name, 'Mobile nav has 3 links', 'WARN', f'Found {mobile_links.count()} links')
                    
                    # Close menu
                    mobile_toggle.click()
                    page.wait_for_timeout(300)
                    
                    if not page.locator('.mobile-nav.active').count() > 0:
                        log_test(viewport_name, 'Mobile menu closes on toggle', 'PASS')
                    else:
                        log_test(viewport_name, 'Mobile menu closes on toggle', 'FAIL', 'Menu did not close')
                else:
                    log_test(viewport_name, 'Mobile menu opens on toggle', 'FAIL', 'Menu did not become active')
            else:
                log_test(viewport_name, 'Mobile toggle visible', 'FAIL', 'Toggle not visible')
    
    # Check theme toggle exists
    theme_toggle = page.locator('[class*="theme-toggle"]')
    if theme_toggle.count() > 0:
        log_test(viewport_name, 'Theme toggle exists', 'PASS')
    else:
        log_test(viewport_name, 'Theme toggle exists', 'WARN', 'Theme toggle not found')
    
    return True

def test_hero_section(page: Page, viewport_name: str, viewport: Dict[str, Any]) -> bool:
    """Test hero section layout and responsiveness"""
    print(f'\n  Testing Hero Section...')
    
    # Check hero section exists
    hero = page.locator('#hero')
    if not hero.count() > 0:
        log_test(viewport_name, 'Hero section exists', 'FAIL', 'Hero section not found')
        return False
    log_test(viewport_name, 'Hero section exists', 'PASS')
    
    # Check main content
    hero_content = hero.locator('.hero-content-wrapper')
    if hero_content.count() > 0:
        log_test(viewport_name, 'Hero content wrapper exists', 'PASS')
    else:
        log_test(viewport_name, 'Hero content wrapper exists', 'FAIL', 'Content wrapper not found')
    
    # Check hero main lines
    hero_lines = hero.locator('.hero-main-line')
    if hero_lines.count() >= 3:
        log_test(viewport_name, 'Hero has 3 main lines', 'PASS')
    else:
        log_test(viewport_name, 'Hero has 3 main lines', 'WARN', f'Found {hero_lines.count()} lines')
    
    # Check metrics highlight
    metrics = hero.locator('.hero-metrics-highlight')
    if metrics.count() > 0:
        log_test(viewport_name, 'Metrics highlight exists', 'PASS')
        
        # Check metric items
        metric_items = metrics.locator('.metric-highlight-item')
        if metric_items.count() >= 4:
            log_test(viewport_name, 'Has 4+ metric items', 'PASS')
        else:
            log_test(viewport_name, 'Has 4+ metric items', 'WARN', f'Found {metric_items.count()} items')
    else:
        log_test(viewport_name, 'Metrics highlight exists', 'WARN', 'Metrics not found')
    
    # Check availability badge
    availability = hero.locator('.hero-availability-badge')
    if availability.count() > 0:
        log_test(viewport_name, 'Availability badge exists', 'PASS')
    else:
        log_test(viewport_name, 'Availability badge exists', 'WARN', 'Badge not found')
    
    # Check CTA buttons
    ctas = hero.locator('.cta-button')
    if ctas.count() >= 2:
        log_test(viewport_name, 'Has 2 CTA buttons', 'PASS')
    else:
        log_test(viewport_name, 'Has 2 CTA buttons', 'WARN', f'Found {ctas.count()} buttons')
    
    # Check particle mesh background
    particles = hero.locator('.particle-mesh-container')
    if particles.count() > 0:
        log_test(viewport_name, 'Particle mesh background exists', 'PASS')
    else:
        log_test(viewport_name, 'Particle mesh background exists', 'WARN', 'Particles not found')
    
    return True

def test_experience_section(page: Page, viewport_name: str, viewport: Dict[str, Any]) -> bool:
    """Test experience section"""
    print(f'\n  Testing Experience Section...')
    
    # Check experience section exists
    experience = page.locator('#experience')
    if not experience.count() > 0:
        log_test(viewport_name, 'Experience section exists', 'FAIL', 'Experience section not found')
        return False
    log_test(viewport_name, 'Experience section exists', 'PASS')
    
    # Scroll to experience
    experience.scroll_into_view_if_needed()
    page.wait_for_timeout(500)
    
    # Check for experience content (may vary based on component structure)
    content = experience.locator('[class*="experience"], [class*="Experience"]')
    if content.count() > 0:
        log_test(viewport_name, 'Experience content exists', 'PASS')
    else:
        log_test(viewport_name, 'Experience content exists', 'WARN', 'No experience content detected')
    
    return True

def test_showcase_section(page: Page, viewport_name: str, viewport: Dict[str, Any]) -> bool:
    """Test showcase/products section"""
    print(f'\n  Testing Showcase Section...')
    
    # Check showcase section exists
    showcase = page.locator('#products')
    if not showcase.count() > 0:
        log_test(viewport_name, 'Showcase section exists', 'FAIL', 'Showcase section not found')
        return False
    log_test(viewport_name, 'Showcase section exists', 'PASS')
    
    # Scroll to showcase
    showcase.scroll_into_view_if_needed()
    page.wait_for_timeout(500)
    
    # Check for showcase content
    content = showcase.locator('[class*="showcase"], [class*="Showcase"], [class*="product"]')
    if content.count() > 0:
        log_test(viewport_name, 'Showcase content exists', 'PASS')
    else:
        log_test(viewport_name, 'Showcase content exists', 'WARN', 'No showcase content detected')
    
    return True

def test_about_section(page: Page, viewport_name: str, viewport: Dict[str, Any]) -> bool:
    """Test about/FAQ section"""
    print(f'\n  Testing About Section...')
    
    # Check about section exists
    about = page.locator('#about')
    if not about.count() > 0:
        log_test(viewport_name, 'About section exists', 'FAIL', 'About section not found')
        return False
    log_test(viewport_name, 'About section exists', 'PASS')
    
    # Scroll to about
    about.scroll_into_view_if_needed()
    page.wait_for_timeout(500)
    
    # Check profile header
    profile = about.locator('.profile-header-card')
    if profile.count() > 0:
        log_test(viewport_name, 'Profile card exists', 'PASS')
        
        # Check avatar
        avatar = profile.locator('.profile-avatar-image')
        if avatar.count() > 0:
            log_test(viewport_name, 'Profile avatar exists', 'PASS')
        else:
            log_test(viewport_name, 'Profile avatar exists', 'WARN', 'Avatar not found')
    else:
        log_test(viewport_name, 'Profile card exists', 'WARN', 'Profile card not found')
    
    # Check FAQ section
    faq = about.locator('.faq-section')
    if faq.count() > 0:
        log_test(viewport_name, 'FAQ section exists', 'PASS')
        
        # Check FAQ tabs
        faq_tabs = faq.locator('.faq-tab')
        if faq_tabs.count() >= 2:
            log_test(viewport_name, 'FAQ has 2+ tabs', 'PASS')
            
            # Test FAQ interaction
            first_tab = faq_tabs.first
            first_tab.click()
            page.wait_for_timeout(300)
            
            # Check FAQ items
            faq_items = faq.locator('.faq-item-card')
            if faq_items.count() > 0:
                log_test(viewport_name, 'FAQ items exist', 'PASS')
                
                # Test FAQ expansion
                first_item = faq_items.first
                first_item.click()
                page.wait_for_timeout(300)
                
                if first_item.locator('.expanded').count() > 0:
                    log_test(viewport_name, 'FAQ expands on click', 'PASS')
                else:
                    log_test(viewport_name, 'FAQ expands on click', 'WARN', 'FAQ did not expand')
            else:
                log_test(viewport_name, 'FAQ items exist', 'WARN', 'No FAQ items found')
        else:
            log_test(viewport_name, 'FAQ has 2+ tabs', 'WARN', f'Found {faq_tabs.count()} tabs')
    else:
        log_test(viewport_name, 'FAQ section exists', 'WARN', 'FAQ section not found')
    
    # Check CTA buttons in profile
    profile_ctas = about.locator('.profile-cta-btn')
    if profile_ctas.count() >= 2:
        log_test(viewport_name, 'Profile has 2+ CTAs', 'PASS')
    else:
        log_test(viewport_name, 'Profile has 2+ CTAs', 'WARN', f'Found {profile_ctas.count()} CTAs')
    
    return True

def test_sticky_cta(page: Page, viewport_name: str, viewport: Dict[str, Any]) -> bool:
    """Test sticky CTA behavior"""
    print(f'\n  Testing Sticky CTA...')
    
    # Start at top of page
    page.evaluate('window.scrollTo(0, 0)')
    page.wait_for_timeout(500)
    
    # Scroll down to trigger sticky CTA
    page.evaluate('window.scrollTo(0, 500)')
    page.wait_for_timeout(1000)
    
    is_mobile = viewport['category'] in ['mobile', 'tablet']
    
    # Check for mobile FAB
    mobile_fab = page.locator('.mobile-fab')
    if is_mobile:
        if mobile_fab.count() > 0:
            log_test(viewport_name, 'Mobile FAB exists', 'PASS')
        else:
            log_test(viewport_name, 'Mobile FAB exists', 'WARN', 'Mobile FAB not found')
    else:
        # Desktop transformable CTA
        desktop_cta = page.locator('.sticky-cta-transformable')
        if desktop_cta.count() > 0:
            log_test(viewport_name, 'Desktop sticky CTA exists', 'PASS')
            
            # Test expansion on hover
            desktop_cta.hover()
            page.wait_for_timeout(300)
            
            if desktop_cta.locator('.expanded').count() > 0:
                log_test(viewport_name, 'Sticky CTA expands on hover', 'PASS')
            else:
                log_test(viewport_name, 'Sticky CTA expands on hover', 'WARN', 'CTA did not expand')
        else:
            log_test(viewport_name, 'Desktop sticky CTA exists', 'WARN', 'Desktop CTA not found')
    
    # Scroll back to top
    page.evaluate('window.scrollTo(0, 0)')
    page.wait_for_timeout(500)
    
    return True

def test_back_to_top(page: Page, viewport_name: str, viewport: Dict[str, Any]) -> bool:
    """Test back to top button"""
    print(f'\n  Testing Back to Top Button...')
    
    # Scroll to bottom
    page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
    page.wait_for_timeout(1000)
    
    # Check for back to top button
    back_to_top = page.locator('[class*="back-to-top"], [class*="BackToTop"]')
    if back_to_top.count() > 0:
        log_test(viewport_name, 'Back to top button exists', 'PASS')
        
        # Test click functionality
        if back_to_top.is_visible():
            back_to_top.first.click()
            page.wait_for_timeout(1000)
            
            scroll_position = page.evaluate('window.scrollY')
            if scroll_position < 100:
                log_test(viewport_name, 'Back to top scrolls to top', 'PASS')
            else:
                log_test(viewport_name, 'Back to top scrolls to top', 'WARN', f'Scroll position: {scroll_position}')
        else:
            log_test(viewport_name, 'Back to top visible after scroll', 'WARN', 'Button not visible')
    else:
        log_test(viewport_name, 'Back to top button exists', 'WARN', 'Button not found')
    
    return True

def test_scroll_navigation(page: Page, viewport_name: str, viewport: Dict[str, Any]) -> bool:
    """Test scroll-based navigation and active states"""
    print(f'\n  Testing Scroll Navigation...')
    
    # Start at top
    page.evaluate('window.scrollTo(0, 0)')
    page.wait_for_timeout(500)
    
    # Scroll through sections
    sections = ['#experience', '#products', '#about']
    for section_id in sections:
        section = page.locator(section_id)
        if section.count() > 0:
            section.scroll_into_view_if_needed()
            page.wait_for_timeout(800)
            
            # Check if nav link becomes active
            active_link = page.locator(f'.nav-link[href="{section_id}"].active')
            if active_link.count() > 0:
                log_test(viewport_name, f'Nav active for {section_id}', 'PASS')
            else:
                log_test(viewport_name, f'Nav active for {section_id}', 'WARN', 'Link not active')
    
    return True

def test_footer(page: Page, viewport_name: str, viewport: Dict[str, Any]) -> bool:
    """Test footer section"""
    print(f'\n  Testing Footer...')
    
    # Check footer exists
    footer = page.locator('footer')
    if footer.count() > 0:
        log_test(viewport_name, 'Footer exists', 'PASS')
    else:
        log_test(viewport_name, 'Footer exists', 'WARN', 'Footer not found')
    
    return True

def test_accessibility(page: Page, viewport_name: str, viewport: Dict[str, Any]) -> bool:
    """Test accessibility features"""
    print(f'\n  Testing Accessibility...')
    
    # Check for skip link
    skip_link = page.locator('.skip-link')
    if skip_link.count() > 0:
        log_test(viewport_name, 'Skip link exists', 'PASS')
    else:
        log_test(viewport_name, 'Skip link exists', 'WARN', 'Skip link not found')
    
    # Check for proper heading hierarchy
    h1 = page.locator('h1')
    if h1.count() > 0:
        log_test(viewport_name, 'Page has H1', 'PASS')
    else:
        log_test(viewport_name, 'Page has H1', 'WARN', 'No H1 found')
    
    # Check ARIA labels on nav
    nav = page.locator('nav[role="navigation"]')
    if nav.count() > 0:
        log_test(viewport_name, 'Nav has proper role', 'PASS')
    else:
        log_test(viewport_name, 'Nav has proper role', 'WARN', 'Nav role not set')
    
    # Check mobile button aria attributes
    mobile_toggle = page.locator('#mobileToggle')
    if mobile_toggle.count() > 0:
        has_aria_label = mobile_toggle.get_attribute('aria-label') is not None
        has_aria_expanded = mobile_toggle.get_attribute('aria-expanded') is not None
        
        if has_aria_label and has_aria_expanded:
            log_test(viewport_name, 'Mobile toggle has ARIA', 'PASS')
        else:
            log_test(viewport_name, 'Mobile toggle has ARIA', 'WARN', 'Missing ARIA attributes')
    
    return True

def run_viewport_tests(page: Page, viewport_name: str, viewport: Dict[str, Any]):
    """Run all tests for a specific viewport"""
    print(f'\n{"="*60}')
    print(f'Testing {viewport_name}: {viewport["device"]} ({viewport["width"]}x{viewport["height"]})')
    print(f'{"="*60}')
    
    # Set viewport
    page.set_viewport_size(viewport)
    page.goto('http://localhost:3000')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(500)
    
    # Take initial screenshot
    take_screenshot(page, f'initial_{viewport_name}', viewport)
    
    # Run tests
    test_navigation(page, viewport_name, viewport)
    test_hero_section(page, viewport_name, viewport)
    test_experience_section(page, viewport_name, viewport)
    test_showcase_section(page, viewport_name, viewport)
    test_about_section(page, viewport_name, viewport)
    test_sticky_cta(page, viewport_name, viewport)
    test_back_to_top(page, viewport_name, viewport)
    test_scroll_navigation(page, viewport_name, viewport)
    test_footer(page, viewport_name, viewport)
    test_accessibility(page, viewport_name, viewport)
    
    # Take final screenshot
    page.evaluate('window.scrollTo(0, 0)')
    page.wait_for_timeout(500)
    take_screenshot(page, f'final_{viewport_name}', viewport)

def generate_report():
    """Generate test report"""
    print(f'\n\n{"="*80}')
    print('TEST SUMMARY REPORT')
    print(f'{"="*80}')
    
    summary = test_results['summary']
    print(f'\nTotal Tests: {summary["total_tests"]}')
    print(f'Passed: {summary["passed"]} ✓')
    print(f'Failed: {summary["failed"]} ✗')
    print(f'Warnings: {summary["warnings"]} ⚠')
    
    print(f'\n{"="*80}')
    print('VIEWPORT BREAKDOWN')
    print(f'{"="*80}')
    
    for vp_name, vp_results in test_results['viewport_results'].items():
        passed = sum(1 for r in vp_results.values() if r['status'] == 'PASS')
        failed = sum(1 for r in vp_results.values() if r['status'] == 'FAIL')
        warnings = sum(1 for r in vp_results.values() if r['status'] == 'WARN')
        total = len(vp_results)
        
        status = '✓' if failed == 0 else '✗' if failed > 0 else '⚠'
        print(f'\n{status} {vp_name}:')
        print(f'   Total: {total} | Passed: {passed} | Failed: {failed} | Warnings: {warnings}')
    
    if test_results['issues']:
        print(f'\n{"="*80}')
        print('ISSUES FOUND')
        print(f'{"="*80}\n')
        for issue in test_results['issues']:
            print(f'• {issue}')
    
    # Save JSON report
    output_dir = Path('.trae/skills/webapp-testing')
    output_dir.mkdir(parents=True, exist_ok=True)
    
    import datetime
    test_results['timestamp'] = datetime.datetime.now().isoformat()
    
    report_file = output_dir / 'responsive_test_report.json'
    with open(report_file, 'w') as f:
        json.dump(test_results, f, indent=2)
    
    print(f'\n\n📄 Full report saved to: {report_file}')
    print(f'📸 Screenshots saved to: {output_dir / "screenshots"}')

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        print('\nStarting Comprehensive Responsive Testing...')
        print('Testing website across multiple viewport sizes\n')
        
        # Test each viewport
        for viewport_name, viewport in VIEWPORTS.items():
            try:
                run_viewport_tests(page, viewport_name, viewport)
            except Exception as e:
                print(f'\n  ❌ Error testing {viewport_name}: {str(e)}')
                log_test(viewport_name, 'Viewport test suite', 'FAIL', str(e))
        
        browser.close()
        
        # Generate report
        generate_report()
        
        print(f'\n{"="*80}')
        print('Testing Complete!')
        print(f'{"="*80}\n')

if __name__ == '__main__':
    main()