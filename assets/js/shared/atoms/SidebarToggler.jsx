export default () => (
    <a href="#" title={'reduire/étendre le menu de gauche'} className="sidebar-toggle" data-toggle="push-menu" role="button"
       onClick={(e)=>{setTimeout(()=>{window.dispatchEvent(new Event('resize'));},20)}}>
        <span className="sr-only">Toggle navigation</span>
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
    </a>
);