import { FC } from "react";
import React from "react";

export const PageContent: FC<{ url: string; }> = ({ url }) => {
    var optimizedUrl = optimizeUrl(url);
    return <iframe src={optimizedUrl}></iframe>;
};

function optimizeUrl(url: string) {
    switch (true) {
        case /^https:\/\/docs\.google\.com\//.test(url):
            return `${url}?rm=minimal`;
        case /^https:\/\/drive\.google\.com\/drive\/folders\//.test(url):
            const folderId = /folders\/([^?]*)/.exec(url)?.[1];
            if (folderId) {
                return `https://drive.google.com/embeddedfolderview?id=${folderId}#list`;
            }
            break;
        case /^https:\/\/app.diagrams.net\/#/.test(url):
            const diagramId = /#(.*)/.exec(url)?.[1];
            if (diagramId) {
                const editUrl = encodeURIComponent(url);
                return `https://viewer.diagrams.net/?highlight=0000ff&edit=${editUrl}&layers=1&nav=1#${diagramId}`;
            }
            break;
    }
    return url;
}

