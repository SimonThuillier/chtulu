import React, { Component } from "react";

// const Slide = require('./Slide').default;
const { red, blue, green, grey } = require('@material-ui/core/colors');
import {AutoRotatingCarousel,Slide} from 'material-auto-rotating-carousel';

export default class HBExplorerPresentation extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            open:true
        };


    }

    render(){
        return (<AutoRotatingCarousel
            label="Fermez l'aide"
            interval={10000}
            open={this.state.open}
            onClose={() => this.setState({ open: false })}
            onStart={() => this.setState({ open: false })}
            style={{ position: 'absolute' }}
        >
            <Slide
                media={<img src={`${document.location.protocol}//${document.location.host}/media/help-new/screen_1.png`} />}
                mediaBackgroundStyle={{ backgroundColor: grey[400] }}
                style={{ backgroundColor: grey[600] }}
                title="Bienvenue sur la page article"
                subtitle='Faîtes defiler cette aide pour découvrir ses fonctionnalités'
            />
            <Slide
                media={<img src={`${document.location.protocol}//${document.location.host}/media/help-new/redilensionne_1.gif`} />}
                mediaBackgroundStyle={{ backgroundColor: grey[400] }}
                style={{ backgroundColor: grey[600] }}
                title='La page comporte 3 zones interactives'
                subtitle="Le texte, la carte et la frise interagissent ensemble pour une navigation interactive.
                Vous pouvez à tout moment redimensionner ces zones en glissant-déposant leurs frontieres."
            />
            <Slide
                media={<img src={`${document.location.protocol}//${document.location.host}/media/help-new/reduire_agrandir.gif`} />}
                mediaBackgroundStyle={{ backgroundColor: green[400] }}
                style={{ backgroundColor: green[600] }}
                title='Etendez et reduisez les zones à volonté'
                subtitle="Vous pouvez etendre une seule zone en double cliquant à l'interieur et la reduire en double-cliquant à nouveau."
            />
            <Slide
                media={<img src={`${document.location.protocol}//${document.location.host}/media/help-new/marqueur_temporel.gif`} />}
                mediaBackgroundStyle={{ backgroundColor: red[400] }}
                style={{ backgroundColor: red[600] }}
                title="Texte et frise communiquent"
                subtitle="Depuis le texte cliquez sur une icone historique pour que la frise bouge vers cette periode.
                Depuis la frise cliquez sur un element pour que le texte se centre au niveau de l'icone correspondante."
            />
            <Slide
                media={<img src={`${document.location.protocol}//${document.location.host}/media/help-new/marqueur_geographique.gif`} />}
                mediaBackgroundStyle={{ backgroundColor: blue[400] }}
                style={{ backgroundColor: blue[600] }}
                title='Texte et carte communiquent'
                subtitle="Depuis le texte cliquez sur une icone carte pour que la carte se centre vers cette zone.
                Depuis la carte cliquez sur un element pour que le texte se centre au niveau de l'icone correspondante."
            />
            <Slide
                media={<img src={`${document.location.protocol}//${document.location.host}/media/help-new/navigation_temporelle.gif`} />}
                mediaBackgroundStyle={{ backgroundColor: blue[400] }}
                style={{ backgroundColor: blue[600] }}
                title='Naviguer dans le temps'
                subtitle="Faîtes defiler la frise ou zoomer/dezoomer grâce aux boutons en bas ou en glisser-deposer et scroll
                avec la souris depuis la zone des elements. Vous pouvez aussi choisir une periode depuis l'entrée en bas ou grâce aux graduations en haut."
            />
            <Slide
                media={<img src={`${document.location.protocol}//${document.location.host}/media/help-new/curseur_temporel.gif`} />}
                mediaBackgroundStyle={{ backgroundColor: blue[400] }}
                style={{ backgroundColor: blue[600] }}
                title='Le curseur temporel'
                subtitle="Le curseur regle à partir de quelle date les élements de la frise sont affichés. Pour voir les
                elements anterieurs naviguez avec la souris. Un double-clic sur le curseur selectionnera automatiquement les
                elements le suivant quand la frise bougera. Un autre double-clic quitte ce mode."
            />
            <Slide
                media={<img src={`${document.location.protocol}//${document.location.host}/media/help-new/astuce_barre_laterale.gif`} />}
                mediaBackgroundStyle={{ backgroundColor: blue[400] }}
                style={{ backgroundColor: blue[600] }}
                title='Bonne navigation'
                subtitle="Pour profiter au mieux de cette page vous pouvez reduire le menu de gauche."
            />
        </AutoRotatingCarousel>);



    }


}