<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use AppBundle\Form\EvolutionType;
use AppBundle\Entity\Evolution;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Entity\Article;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * @Route("/event")
 */
class EvolutionController extends Controller
{
    /**
     * @Route("/create")
     * @Template()
     */
    public function createAction(Request $request)
    {
    	$evolution= new Evolution();
    	$form = $this->createForm(EvolutionType::class, $evolution)
    	->add('save', SubmitType::class, array('label' => 'Creer evolution'));
    	 
    	$form->handleRequest($request);
    	 
    	if ($form->isSubmitted() && $form->isValid()) {
    		$em = $this->getDoctrine()->getManager();
    		$evolution->setCreationDate(new \DateTime());
    		$evolution->setEditionDate(new \DateTime());
    	
    		// update of article linked to the evolution
    		$article = new Article();
    		$article->setTitle('evolution_' . $evolution->getTitle());
    		$article->setCreationDate(new \DateTime());
    		$article->setEditionDate(new \DateTime());
    		$article->setAbstract($evolution->getBufferAbstract());
    		
    		$evolution->setArticle($article);
    	
    		$em->persist($article);
    		$em->persist($evolution);
    		$em->flush();
    		 
    		return $this->redirect($this->generateUrl(
    				'article_evolution_edit',
    				array('id' => $evolution->getId())
    				));
    	}
    	
        return array(
        'form_article' => $form->createView()
        );
    }
    
    /**
     * @Route("/edit/{id}")
     * @Template()
     */
    public function editAction(Request $request,$id)
    {
    	$evolution= $this->getDoctrine()->getRepository('EntityBundle:Evolution')->find($id);
    	$form = $this->createForm(EvolutionType::class, $evolution)
    	->add('save', SubmitType::class, array('label' => 'Editer evolution'));
    	 
    	$form->handleRequest($request);
    
    	if ($form->isSubmitted() && $form->isValid()) {
    		$em = $this->getDoctrine()->getManager();
    		
    		$evolution->setEditionDate(new \DateTime());
    		
    		
    		$article=$evolution->getArticle();
    		$article->setTitle('evolution_' . $evolution->getTitle());
    		$article->setEditionDate(new \DateTime());
    		// $article->setAbstract($evolution->getArticleAbstract());
    		
    		
    		
    		$em->flush();
    	}
    	return array('form_article' => $form->createView());
    }

}
