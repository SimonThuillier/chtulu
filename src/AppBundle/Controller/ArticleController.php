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
use AppBundle\Processor\GenericProcessor;
use AppBundle\Listener\SearchArticleFormListener;
use AppBundle\Helper\DateHelper;
use AppBundle\Entity\DateType;
use AppBundle\Factory\HDateFactory;
use AppBundle\Utils\HDate;
use AppBundle\Mapper\AutoMapper;
use Symfony\Component\HttpFoundation\JsonResponse;

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
        $articleDTO = $articleDTOFactory->newInstance("main_collection");
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
                return new JsonResponse(json_encode($articleDTO));
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
                        'formData' => json_encode($form->getData()),
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
            'modalForm' => $modalForm->createView(),
            'beginDate' => (new \DateTime())->sub(new \DateInterval('P30D')),
            'endDate' =>(new \DateTime())
        ));
    }
    
    /**
     * @Route("/test",name="article_test")
     */ 
    public function testAction(HDateFactory $dateFactory)
    {
        /** @var \DateTime $date */
        $date = DateHelper::createFromFormat('d/m/Y', "01/01/1");
        // $date->modify("-1 year");
        $date2 = clone $date ;
        DateHelper::switchToNextSeason($date2);
        
        $dateType = $this->getDoctrine()->getRepository('AppBundle:DateType')
        ->find(DateType::PRECISE);
        $hDate = $dateFactory->newInstance($dateType, $date);
        $hDate2 = $dateFactory->newInstance($dateType, $date2);
        
        AutoMapper::autoMap($hDate, $hDate2);
        
        $index = DateHelper::dateToIndex($date);
        $newDate = DateHelper::indexToDate($index);
        
        $date0 = \DateTime::createFromFormat('d/m/Y', '01/05/0000');
        
        return $this->render('::debug.html.twig', array(
            'debug' => array(
                'date' => $date->format('d/m/Y'),
                'index' => $index,
                'newDate' => $newDate,
                'date0' => $date0,
                'test' => method_exists($hDate, 'getBeginDate'),
                'test2' => method_exists($hDate, 'getbegindate'),
                'test3' => property_exists($hDate, 'lol'),
                'blop' => HDate::toJSON($hDate2),
                'mois' => DateHelper::getMonth($date),
                'hDate' => HDate::toJSON($hDate),
                'date2' => $date2->format('d/m/Y'),
                'date2bis' => strftime("%B",$date2->getTimestamp()),
                'value' => Article::class,
                'test_vars' => json_encode(get_object_vars($hDate2)),
                'test_func' => json_encode(get_class_methods(get_class($hDate2))),
                'test_func2' => json_encode((array)$hDate2),
                'test_func3' => json_encode( array_keys((array)$hDate2))
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
        
        foreach($articleDTO->subEventsArray as $subEvent){
            $subEvent->url = $this->generateUrl('article_edit',array("article" => $subEvent->id));
        }
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
                'subEvents' => $articleDTO->subEvents,
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
                /** @var ArticleCollectionDTO $articleCollectionDTO */
                // $articleCollectionDTO = $serializer->deserialize($articleDTO->getSubEvents(), null, 'json');
                /** ArticleCollectionDoctrineMapper $mapper */
                $collectionMapper->edit($article->getId(),$articleDTO);
                
                
                return $this->render('::debug.html.twig', array(
                    'debug' => array(
                        "dto" => json_encode($articleDTO),
                        "title" => $articleDTO->title
                    )
                ));
            } else {
                
                return $this->render('::debug.html.twig', array(
                    'debug' => array(
                        'formErrors' => json_encode($form['endDate']->getErrors()),
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
            'modalForm' => $modalForm->createView(),
            'beginDate' => ($articleDTO->isBeginDateApprox)?$articleDTO->minBeginDate:$articleDTO->beginDate,
            'endDate' =>($articleDTO->hasNotEndDate)?new \DateTime():
            (($articleDTO->isEndDateApprox)?$articleDTO->maxEndDate:$articleDTO->endDate)
        ));
    }
    
    /**
     * @Route("/list",name="article_list")
     * @Method({"GET","POST"})
     */
    public function listAction(Request $request,GenericProcessor $processor,SearchArticleFormListener $listener)
    {
        /** @var Event$result */
        $result = $processor->addSubscriber($listener)->process($request);
        
        return $this->render('@AppBundle/Article/list.html.twig',$result);
    }
    
    
}
