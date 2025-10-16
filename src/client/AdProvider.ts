import { CrazySDK } from "./CrazyGamesSDK";
import { NitroPaySDK } from "./NitroPaySDK";

class AdProviderManager {
  public readonly isCrazyGames = CrazySDK.isCrazyGames;
  private initialized = false;
	private refreshTimerId: number | null = null;

	private readonly nitroCommonOptions: Record<string, any> = {
		sizes: [["300", "600"]],
		report: {
			enabled: true,
			icon: true,
			wording: "Report Ad",
			position: "top-right",
		},
	};

  async init(): Promise<void> {
    if (this.initialized) return;

    // Initialize CrazyGames (non-blocking)
    void CrazySDK.init();

		// Initialize NitroPay only if not in CrazyGames (non-blocking)
		void NitroPaySDK.init({ shouldLoad: !this.isCrazyGames });

		// Initial render across providers
		void this.renderBanners();

		// Set up a unified refresh timer
		if (this.refreshTimerId === null) {
			this.refreshTimerId = window.setInterval(() => {
				void this.renderBanners();
			}, 60000);
		}

    this.initialized = true;
  }

	async renderBanners(): Promise<void> {
    console.log("renderBanners");
		if (this.isCrazyGames) {
			// CrazyGames responsive banners
			void CrazySDK.requestResponsiveBanner("cg-banner-left");
			void CrazySDK.requestResponsiveBanner("cg-banner-right");
			// Bottom banner may be disabled in markup, safe to request
			// void CrazySDK.requestResponsiveBanner("cg-banner-bottom");
			return;
		}

		// NitroPay banners (non-CrazyGames)
		void NitroPaySDK.renderBanner("frontwars-300x600", this.nitroCommonOptions);
		void NitroPaySDK.renderBanner("frontwars-300x600_2", this.nitroCommonOptions);
		// void NitroPaySDK.renderBanner("frontwars-728x90", {
		// 	sizes: [["728", "90"]],
		// 	report: this.nitroCommonOptions.report,
		// });
	}
}

export const AdProvider = new AdProviderManager();


