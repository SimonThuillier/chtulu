<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use AppBundle\Entity\Article;
use AppBundle\Form\ArticleMainType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use AppBundle\DTO\ArticleMainDTO;
use Symfony\Component\Form\FormBuilderInterface;
use AppBundle\Factory\ArticleDTOFactory;
use AppBundle\Form\ArticleModalType;

/**
 * 
 * @author belze
 * @Route("/article")
 */
class ArticleController extends Controller
{
    
    /**
     * @Route("/create",name="article_create")
     * @Template()
     */
    public function createAction(Request $request,ArticleDTOFactory $articleDTOFactory)
    {
    	$article= new Article();
    	$articleDTO = $articleDTOFactory->newInstance("main");
    	$articleModalDTO = $articleDTOFactory->newInstance("modal");
    	// $form = $this->createForm(ArticleType::class, $articleDTO);
    	/** @var FormInterface $form */
    	$form = $this->get('form.factory')->createBuilder(ArticleMainType::class)->setData($articleDTO)->getForm();
    	/** @var FormInterface $form */
    	$modalForm = $this->get('form.factory')->createBuilder(ArticleModalType::class)->setData($articleModalDTO)->getForm();
    	
    	//->add('save', SubmitType::class, array('label' => 'Creer article'));
    	
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
    	return array(
    	    'form' => $form->createView(),
    	    'modalForm' => $modalForm->createView()
    	);
    }
    
    /**
     * @Route("/edit/{id}")
     * @Template()
     */
    public function editAction(Request $request,$id)
    {
    	$article= $this->getDoctrine()->getRepository('EntityBundle:Article')->find($id);
    	$form = $this->createForm(ArticleMainType::class, $article)
    	->add('save', SubmitType::class, array('label' => 'Editer article'));
    	
    	$form->handleRequest($request);
    	 
    	if ($form->isSubmitted() && $form->isValid()) {
    		$em = $this->getDoctrine()->getManager();
    		$em->flush();
    	}
    	return array('form_article' => $form->createView());
    }
}
