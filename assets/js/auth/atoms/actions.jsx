import React, {Component} from 'react';
import {COLORS} from '../../util/notifications';
import {
    Glyphicon
} from 'react-bootstrap';


export function Edit(props) {
    return (
        <a className="edit"
           style={{color:COLORS.ACTION_EDIT} }
           href="javascript:void(0)"
           title="Editer">
            <Glyphicon
                onClick={props.onClick}
                glyph="edit"
            />
        </a>
    );
}

export function Submit(props) {
    return (
        <a className="submit"
           style={{color:COLORS.ACTION_SUBMIT} }
           href="javascript:void(0)"
           title="Enregistrer">
            <Glyphicon
                onClick={props.onClick}
                glyph="upload"
            />
        </a>
    );
}

export function Reset(props) {
    return (
        <a className="reset"
           style={{color:COLORS.ACTION_RESET} }
           href="javascript:void(0)"
           title="Reinitialiser">
            <Glyphicon
                onClick={props.onClick}
                glyph="erase"
            />
        </a>
    );
}


export function Delete(props) {
    return (
        <a
            style={{color:COLORS.ACTION_DELETE} }
            href="javascript:void(0)"
            title="Supprimer">
            <Glyphicon
                onClick={props.onClick}
                glyph="remove"
            />
        </a>
    );
}

export function CancelDelete(props) {
    return (
        <a
            style={{color:COLORS.ACTION_CANCEL_DELETE} }
            className="cancel-delete"
            href="javascript:void(0)"
            title="Annuler suppression">
            <Glyphicon
                onClick={props.onClick}
                glyph="erase"
            />
        </a>
    );
}

export function CancelAdd(props) {
    return (
        <a
            style={{color:COLORS.ACTION_CANCEL_ADD} }
            className="cancel-add"
            href="javascript:void(0)"
            title="Annuler ajout">
            <Glyphicon
                onClick={props.onClick}
                glyph="erase"
            />
        </a>
    );
}