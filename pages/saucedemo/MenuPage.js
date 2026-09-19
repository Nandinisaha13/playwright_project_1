export class MenuPage {
  constructor(page) {
    this.page = page;
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.aboutLink = page.getByTestId('about-sidebar-link');
    this.allItemsLink = page.getByTestId('inventory-sidebar-link');
    this.logoutLink = page.getByTestId('logout-sidebar-link');
  }

  async openMenu() {
    await this.menuButton.click();
  }

  async goToAbout() {
    await this.openMenu();
    await this.aboutLink.click();
  }

  async goToAllItems() {
    await this.openMenu();
    await this.allItemsLink.click();
  }

  async logout() {
    await this.openMenu();
    await this.logoutLink.click();
  }
}
