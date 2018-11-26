import {Tooltip} from 'react-bootstrap';

export const previewTooltip = (what) => (
    <Tooltip id="preview-tooltip">
        Previsualiser {what}.
        Vos modifications sont conservées et vous
        pourrez revenir ici editer :)
    </Tooltip>
);

export const submitTooltip = (what=null) => (
    <Tooltip id="preview-tooltip">
        Sauvegarder {what?what:'toutes vos modifications'} vers le site.
        Un petit temps d'envoi est à prevoir ;)
    </Tooltip>
);

export const resetTooltip = (what=null) => (
    <Tooltip id="preview-tooltip">
        {what?`Retablir ${what} depuis les dernieres données enregistrées.`:`Reinitialiser aux dernieres données enregistrées.`}
        <strong>{what?`Attention : vos modifications sur ${what} seront effacées !`:`Toutes vos modifications non enregistrées seront effacées !`}</strong>
        Je vous ai prevenu.
    </Tooltip>
);