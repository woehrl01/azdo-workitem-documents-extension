# Azure DevOps - Work Item Documents Viewer extension

Would you like to view all documents of a work item without opening several new tabs? This extension will display all linked documents in a tab next to the work item. Cool, huh? 🤩

### How?

All relations of the type _Hyperlink_ are embedded into a new tab _Documents_ on the work item form. Depending on the URL, an optimized visualization is displayed so that you can perform actions directly.

The comment of the _Hyperlink_ is used as the title of the tab.

### Supported optimizations

- Google Documents (Embedded mode for Docs, Sheets, Slides, etc.)
- Google Drive (Displayed as list)
- [diagrams.net/draw.io](https://app.diagrams.net/) (Viewer mode)

_If you have additional ideas, please create an [issue](https://github.com/woehrl01/azdo-workitem-documents-extension/issues)._

### Screenshot

![diagrams.net](static/diagrams.net.png)

---

### FAQ

#### How can I hide the tab from specific work item types?

You can hide the tab by [modifing your process](https://docs.microsoft.com/en-us/azure/devops/organizations/settings/work/customize-process-form?view=azure-devops). Use _Hide from layout_ on the specific work item type.

![hide from layout](static/hide_from_layout.png)

---

In some scenarios, this extension might be treated as a must-have feature. I hope that it will be useful for you and your team. The extension is available on the [Azure DevOps Marketplace](https://marketplace.visualstudio.com/items?itemName=lukaswoehrl.azdo-workitem-documents) and on [GitHub](https://github.com/woehrl01/azdo-workitem-documents-extension) under MIT license!

---

_[Document icons created by Driss Lebbat - Flaticon](https://www.flaticon.com/free-icons/document)_