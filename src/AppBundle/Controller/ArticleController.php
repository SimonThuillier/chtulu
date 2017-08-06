<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use AppBundle\Entity\Article;
use AppBundle\Form\ArticleType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * 
 * @author belze
 * @Route("/article")
 */
class ArticleController extends Controller
{
    
    /**
     * @Route("/create")
     * @Template()
     */
    public function createAction(Request $request)
    {
    	$article= new Article();
    	$form = $this->createForm(ArticleType::class, $article)
    	->add('save', SubmitType::class, array('label' => 'Creer article'));
    	
    	$form->handleRequest($request);
    	
    	if ($form->isSubmitted() && $form->isValid()) {
    		$em = $this->getDoctrine()->getManager();
    		$article->setCreationDate(new \DateTime());
    		$article->setEditionDate(new \DateTime());
    		
    		
    		$em->persist($article);
    		$em->flush();
    	
    		return $this->redirect($this->generateUrl(
    				'article_default_edit',
    				array('id' => $article->getId())
    				));
    	}
    	return array('form_article' => $form->createView());
    }
    
    /**
     * @Route("/edit/{id}")
     * @Template()
     */
    public function editAction(Request $request,$id)
    {
    	$article= $this->getDoctrine()->getRepository('EntityBundle:Article')->find($id);
    	$form = $this->createForm(ArticleType::class, $article)
    	->add('save', SubmitType::class, array('label' => 'Editer article'));
    	
    	$form->handleRequest($request);
    	 
    	if ($form->isSubmitted() && $form->isValid()) {
    		$em = $this->getDoctrine()->getManager();
    		$em->flush();
    	}
    	return array('form_article' => $form->createView());
    }
}
