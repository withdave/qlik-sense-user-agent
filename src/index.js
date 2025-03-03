// External imports
import { useElement, useLayout, useApp } from "@nebula.js/stardust";

// Internal imports
import properties from "./object-properties";
import data from "./data";
import ext from "./ext";

export default function supernova(galaxy) {
  return {
    qae: {
      properties: {
        properties,
        data,
      },
    },
    
    ext: ext(galaxy), // Ensure ext is correctly imported and used
    component() {
      // Stardust hooks
      const el = useElement();
      const layout = useLayout();
      const qlikApp = useApp();

      // Set the user agent in the Qlik variable and render the content
      const userAgent = navigator.userAgent;
      const userAgentIsMobile = userAgent.includes("Mobi");
      const variableName = "vUserAgent";

      // Check if the variable exists and create it if it doesn't
      const updateVariable = async () => {
        if (qlikApp) {
          const newVariable = {
            qInfo: {
              qType: "variable",
            },
            qName: variableName,
            qDefinition: userAgent,
            qComment: "",
            tags: [],
            qIncludeInBookmark: false,
          };

            // Redirect handling for identity
            const url = new URL(window.location.href);
            console.log(`URL: ${url}`);
            const pathParts = url.pathname.split('/');
            const identityIndex = pathParts.findIndex(part => part.toLowerCase() === 'identity');
            let shouldRedirect = false;

            // need to add "shouldRedirect code"
            if (identityIndex !== -1 && pathParts[identityIndex + 1]) {
              const wildcardValue = pathParts[identityIndex + 1].toLowerCase();
              if (userAgentIsMobile && wildcardValue !== 'mobile') {
              pathParts[identityIndex + 1] = 'mobile';
              shouldRedirect = true;
              } else if (!userAgentIsMobile && wildcardValue === 'mobile') {
              pathParts[identityIndex + 1] = 'web';
              shouldRedirect = true;
              }
            } else if (userAgentIsMobile && identityIndex === -1) {
              pathParts.push('identity', 'mobile');
              shouldRedirect = true;
            }
            const newUrl = `${url.origin}${pathParts.join('/')}${url.search}`;
            if (shouldRedirect && !newUrl.includes("http://localhost:8000/dev/")) {
              console.log(`Redirecting to: ${newUrl}`);
              window.location.href = newUrl;
            }

          try {
            let variable;
            try {
              variable = await qlikApp.getVariableByName({ qName: variableName });
            } catch {
              variable = await qlikApp.createSessionVariable(newVariable);
              variable = await qlikApp.getVariableByName({ qName: variableName });
            }
            await variable.setStringValue(userAgent);
            console.log(`Session variable ${variableName} set to: ${userAgent}`);
          } catch (err) {
            console.error("Error handling variable:", err);
          }
        } else {
          console.error("Unable to access app.");
        }
      };

      updateVariable();

      // Render the user agent on the screen
      const icon = userAgentIsMobile ? "📱" : "💻";
      el.innerHTML = `${icon}`;
      el.title = userAgent;
    },
    mounted() {
      // Re-evaluate the component whenever there is an update in the app
      this.component();
    },
    updated() {
      // Re-evaluate the component whenever there is an update in the app
      this.component();
    },
  };
}
