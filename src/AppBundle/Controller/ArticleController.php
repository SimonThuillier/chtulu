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
use AppBundle\DTO\ArticleCollectionDTO;
use AppBundle\Factory\ArticleDTOFactory;
use AppBundle\Form\ArticleModalType;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\SerializerInterface;
use AppBundle\Helper\ArticleHelper;
use AppBundle\Entity\ArticleType;
use AppBundle\Mapper\ArticleCollectionDoctrineMapper;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use AppBundle\Repository\ArticleRepository;

/**
 *
 * @author belze
 *         @Route("/article")
 */
class ArticleController extends Controller
{

    /**
     * @Route("/create",name="article_create")
     * @Method({"GET","POST"})
     */
    public function createAction(Request $request, ArticleDTOFactory $articleDTOFactory,
        ArticleCollectionDoctrineMapper $collectionMapper)
    {
        /** @var ArticleCollectionDTO $articleDTO */
        /** @var ArticleModalDTO $articleModalDTO */
        /** @var ArticleMainType $form */
        $form = $this->get('form.factory')->createBuilder(ArticleMainType::class)
            ->setData($articleDTO)->getForm();
        /** @var FormInterface $modaForm */
        $modalForm = $this->get('form.factory')->createBuilder(ArticleModalType::class)
            ->setData($articleDTOFactory->newInstance("modal"))->getForm();
        
        $form->handleRequest($request);
        if ($form->isSubmitted()) {
            if ($form->isValid()) {
                $articleDTO = $form->getData();
                $collectionMapper->add($articleDTO);
                return $this->render('::debug.html.twig', array(
                    'debug' => array(
                        "title" => $articleDTO->title,
                        "titlesub1" => $articleDTO->subEventsArray[0]->title,
                    )
                ));
            } else {
                
                return $this->render('::debug.html.twig', array(
                    'debug' => array(
                        'formErrors' => json_encode($form->getErrors(true, false)),
                        'form_submitted' => json_encode($form->isSubmitted()),
                        'form_valid' => json_encode($form->isValid())
                    )
                ));
            }
        }
        
        return $this->render('@AppBundle/Article/create.html.twig',array(
            'typeSubtypeArray' => $this->getDoctrine()->getManager()->getRepository(ArticleType::class)->getTypeSubTypeArray(),
            'form' => $form->createView(),
            'modalForm' => $modalForm->createView()
        ));
    }
    /**
     * @Route("/test",name="article_test")
     */
    public function testAction()
    {
        return $this->render('::debug.html.twig', array(
            'debug' => array(
                'value' => Article::class
            )
        ));
    }

    /**
     * @Route("/edit/{article}",name="article_edit",requirements={"page": "\d+"})
     * @ParamConverter("article", class="AppBundle:Article")
     * @Method({"GET","POST"})
     */
    public function editAction(Article $article,Request $request, ArticleDTOFactory $articleDTOFactory,ArticleHelper $helper,
        ArticleCollectionDoctrineMapper $collectionMapper)
    {
        /** @var ArticleRepository */
        $repo = $this->getDoctrine()->getRepository('AppBundle:Article');
        /** @var ArticleCollectionDTO $articleDTO */
        $articleDTO = $articleDTOFactory->newInstance("main_collection");
        $repo->bindDTO($article->getId(),$articleDTO);
        $helper->serializeSubEvents($articleDTO);
        /** @var ArticleModalDTO $articleModalDTO */
        /** @var ArticleMainType $form */
        
        
        $form = $this->get('form.factory')->createBuilder(ArticleMainType::class)
        ->setData($articleDTO)->getForm();
        /** @var FormInterface $modaForm */
        $modalForm = $this->get('form.factory')->createBuilder(ArticleModalType::class)
        ->setData($articleDTOFactory->newInstance("modal"))->getForm();
        
        /*return $this->render('::debug.html.twig', array(
            'debug' => array(
                'date' => $article->getMinBeginDate(),
                'date2' => $articleDTO->beginDate,
                'date3' => $articleDTO->minBeginDate,
                'article_title' => $article->getTitle(),
                'dto' => json_encode($articleDTO),
            )
        ));*/
        
        
        $form->handleRequest($request);
        if ($form->isSubmitted()) {
            if ($form->isValid()) {
                $articleDTO = $form->getData();
                if (! $helper->deserializeSubEvents($articleDTO))
                {
                    throw new \Exception("An error occured during subArticles recovery. No data was saved.");
                }
                /** @var ArticleCollectionDTO $articleCollectionDTO */
                // $articleCollectionDTO = $serializer->deserialize($articleDTO->getSubEvents(), null, 'json');
                /** ArticleCollectionDoctrineMapper $mapper */
                $collectionMapper->add($articleDTO);
                
                
                return $this->render('::debug.html.twig', array(
                    'debug' => array(
                        "title" => $articleDTO->title,
                        "titlesub1" => $articleDTO->subEventsArray[0]->title,
                    )
                ));
            } else {
                
                return $this->render('::debug.html.twig', array(
                    'debug' => array(
                        'formErrors' => json_encode($form->getErrors(true, false)),
                        'form_submitted' => json_encode($form->isSubmitted()),
                        'form_valid' => json_encode($form->isValid())
                    )
                ));
            }
        }
        
        return $this->render('@AppBundle/Article/edit.html.twig',array(
            'article' => $articleDTO,
            'typeSubtypeArray' => $this->getDoctrine()->getManager()->getRepository(ArticleType::class)->getTypeSubTypeArray(),
            'form' => $form->createView(),
            'modalForm' => $modalForm->createView()
        ));
    }
}
