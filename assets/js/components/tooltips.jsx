import {Tooltip} from 'react-bootstrap';

export const previewTooltip = (what) => (
    <Tooltip id="preview-tooltip">
        Previsualiser {what}.
        Vos modifications sont conservées et vous
        pourrez revenir ici editer :)
    </Tooltip>
);

export const submitTooltip = (what) => (
    <Tooltip id="preview-tooltip">
        Sauvegarder {what} vers le site.
        Un petit temps d'envoi est à prevoir ;)
    </Tooltip>
);

export const resetTooltip = (what) => (
    <Tooltip id="preview-tooltip">
        Retablir {what} depuis les dernieres données enregistrées.
        <strong>Attention : vos modifications sur {what} seront effacées !</strong>
        Je vous ai prevenu.
    </Tooltip>
);