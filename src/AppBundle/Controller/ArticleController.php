<?php
namespace AppBundle\Controller;

use AppBundle\DTO\ArticleDTO;
use AppBundle\Factory\DTOFactory;
use AppBundle\Factory\MediatorFactory;
use AppBundle\Form\ArticleDTOType;
use AppBundle\Form\ArticleSearchType;
use AppBundle\Form\HFileUploadType;
use AppBundle\Helper\BootstrapListHelper;
use AppBundle\Mapper\ArticleMapper;
use AppBundle\Mediator\ArticleDTOMediator;
use AppBundle\Mediator\DTOMediator;
use AppBundle\Serializer\ArticleDTONormalizer;
use AppBundle\Serializer\UrlEncoder;
use AppBundle\Utils\HJsonResponse;
use AppBundle\Utils\SearchBag;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use AppBundle\Entity\Article;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;
use AppBundle\Helper\ArticleHelper;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\Encoder\JsonEncoder;

/**
 *
 * @author belze
 *         @Route("/article")
 */
class ArticleController extends Controller
{
    /**
     * @param Request $request
     * @param MediatorFactory $mediatorFactory
     * @param ArticleDTONormalizer $normalizer
     * @param JsonEncoder $encoder
     * @Route("/create",name="article_create")
     * @Method({"GET"})
     * @throws \Exception
     * @return Response
     */
    public function createAction(Request $request,
                                 MediatorFactory $mediatorFactory,
                                 ArticleDTONormalizer $normalizer,
                                 JsonEncoder $encoder)
    {
        $groups = ['minimal','abstract','date','detailImage'];

        $mediator = $mediatorFactory->create(ArticleDTOMediator::class);
        $articleDto = $mediator
            ->mapDTOGroups(array_merge($groups,['url']))
            ->getDTO();

        $form = $this
            ->get('form.factory')
            ->createBuilder(ArticleDTOType::class,$articleDto,[
                'validation_groups'=>$groups
            ])
            ->getForm();

        return $this->render('@AppBundle/Article/edit.html.twig',[
                "title" => "[Creer] Nouvel article",
                "articleDTO" =>$encoder->encode($normalizer
                    ->normalize($articleDto,array_merge($groups,['groups','url','type'])),'json'),
                "form" => $form->createView(),
                "fileUploadForm" => $this->get('form.factory')
                    ->createBuilder(HFileUploadType::class,null)->getForm()->createView()
            ]
        );
    }

    /**
     * @param Request $request
     * @param MediatorFactory $mediatorFactory
     * @param ArticleMapper $mapper
     * @param ArticleDTONormalizer $normalizer
     * @Route("/post-create",name="article_post_create")
     * @Method({"POST","GET"})
     * @throws \Exception
     * @return JsonResponse
     */
    public function postCreateAction(Request $request,
                                     MediatorFactory $mediatorFactory,
                                     ArticleMapper $mapper,
                                     ArticleDTONormalizer $normalizer)
    {
        $hResponse = new HJsonResponse();
        $groups = $request->get("groups",['minimal']);
        $errors=[];
        $groups=['minimal','date','abstract'];
        $data = null;
        try{
            $mediator = $mediatorFactory->create(ArticleDTOMediator::class);
            $mediator->mapDTOGroups($groups);
            $form = $this
                ->get('form.factory')
                ->createBuilder(ArticleDTOType::class,$mediator->getDTO(),[
                    'validation_groups'=>$groups])
                ->add('save',SubmitType::class)
                ->getForm();

            $mediator->resetChangedProperties();
            $form->submit($request->request->get("form"));
            $errors = $this->get('validator')->validate($mediator->getDTO());
            if (! $form->isValid() || count($errors)>0)
            {
                throw new \Exception("Le formulaire contient des erreurs à corriger avant creation");
            }
            $mapper->add($mediator->getDTO());
            $mediator->mapDTOGroups(['url']);
            $hResponse
                ->setMessage("L'article a été creé")
                ->setData($normalizer->normalize($mediator->getDTO(),['minimal','url']));
        }
        catch(\Exception $e){
            $hResponse->setStatus(HJsonResponse::ERROR)
                ->setMessage($e->getMessage())
                ->setErrors(HJsonResponse::normalizeFormErrors($errors));
        }
        return new JsonResponse(HJsonResponse::normalize($hResponse));
    }

    /**
     * @param Article $article
     * @param MediatorFactory $mediatorFactory
     * @param ArticleDTONormalizer $normalizer
     * @Route("/view/{article}",name="article_view")
     * @Method({"GET"})
     * @throws \Exception
     * @return Response
     */
    public function viewAction(Article $article,
                               MediatorFactory $mediatorFactory,
                               ArticleDTONormalizer $normalizer){
        $groups = ['minimal','date','abstract','detailImage'];

        $mediator = $mediatorFactory->create(ArticleDTOMediator::class,$article);
        $articleDto = $mediator
            ->mapDTOGroups($groups)
            ->getDTO();

        return $this->render('@AppBundle/Article/view.html.twig',[
                "title" => $articleDto->getTitle(),
                "articleDTO" =>json_encode($normalizer->normalize($articleDto,array_merge($groups,['groups','type'])))
            ]
        );
    }

    /**
     * @param Request $request
     * @param Article $article
     * @param MediatorFactory $mediatorFactory
     * @param ArticleDTONormalizer $normalizer
     * @param JsonEncoder $encoder
     * @Route("/edit/{article}",name="article_edit")
     * @ParamConverter("article", class="AppBundle:Article")
     * @Method({"GET"})
     * @throws \Exception
     * @return Response
     */
    public function editAction(Request $request,
                               Article $article,
                               MediatorFactory $mediatorFactory,
                               ArticleDTONormalizer $normalizer,
                               JsonEncoder $encoder)
    {
        $groups = ['minimal','abstract','date','detailImage','hteRange'];

        $mediator = $mediatorFactory->create(ArticleDTOMediator::class,$article);
        $articleDto = $mediator
            ->mapDTOGroups(array_merge($groups,['url']))
            ->getDTO();

        $form = $this
            ->get('form.factory')
            ->createBuilder(ArticleDTOType::class,$articleDto,[
                'validation_groups'=>$groups
            ])
            ->getForm();

        return $this->render('@AppBundle/Article/edit.html.twig',[
                "title" => "[Editer] " . $articleDto->getTitle(),
                "articleDTO" =>$encoder->
                encode($normalizer->normalize($articleDto,array_merge($groups,['groups','url','type'])),'json'),
                "form" => $form->createView(),
                "fileUploadForm" => $this->get('form.factory')
                    ->createBuilder(HFileUploadType::class,null)->getForm()->createView()
            ]
        );
    }

    /**
     * @param Request $request
     * @param Article $article
     * @param MediatorFactory $mediatorFactory
     * @Route("/post-edit/{article}",name="article_post_edit")
     * @ParamConverter("article", class="AppBundle:Article")
     * @Method({"POST","GET"})
     * @return JsonResponse
     */
    public function postEditAction(Request $request,
                                   Article $article,
                                   MediatorFactory $mediatorFactory,
                                   ArticleMapper $mapper)
    {
        $hResponse = new HJsonResponse();
        $groups = $request->get("groups",['minimal']);
        $errors=[];
        try{
            $mediator = $mediatorFactory->create(ArticleDTOMediator::class,$article);
            $mediator->mapDTOGroups($groups);
            $form = $this
                ->get('form.factory')
                ->createBuilder(ArticleDTOType::class,$mediator->getDTO(),[
                    'validation_groups'=>$groups])
                ->add('save',SubmitType::class)
                ->getForm();

            $mediator->resetChangedProperties();

            $form->submit($request->request->get("form"));
            //$this->get('logger')->info($request->request->get("form"));
            $errors = $this->get('validator')->validate($mediator->getDTO());
            if (! $form->isValid() || count($errors)>0)
            {
                throw new \Exception("Le formulaire contient des erreurs à corriger avant validation");
            }
            $mapper->edit($mediator->getDTO());
            $hResponse->setMessage("L'article a été mis à jour");
        }
        catch(\Exception $e){
            $hResponse->setStatus(HJsonResponse::ERROR)
                ->setMessage($e->getMessage())
                ->setErrors(HJsonResponse::normalizeFormErrors($errors));
        }
        return new JsonResponse(HJsonResponse::normalize($hResponse));
    }



    /**
     * @param Request $request
     * @param Article $article
     * @Route("/cancel/{article}",name="article_cancel")
     * @ParamConverter("article", class="AppBundle:Article")
     * @Method({"POST"})
     * @return Response
     */
    public function cancelAction(Request $request,
                                 Article $article)
    {
        $this->get('session')->remove('processedConfirmation');
        return new Response("OK");
    }


    /**
     * @param Request $request
     * @param Article $article
     * @param ArticleMapper $mapper
     * @Route("/delete/{article}",name="article_delete")
     * @ParamConverter("article", class="AppBundle:Article")
     * @Method({"GET","POST"})
     * @return JsonResponse
     */
    public function deleteAction(Request $request,
                                   Article $article,
                                   ArticleMapper $mapper)
    {
        $hResponse = new HJsonResponse();
        /** @var Session $session */
        $session = $this->get('session');

        $confirm = null;
        if(! $session->has('processedConfirmation')){
            try{
                $confirm = $mapper->confirmDelete($article->getId());
                $session->set('processedConfirmation',$article->getId());
            }
            catch(\Exception $e){
                $hResponse->setStatus(HJsonResponse::ERROR)
                    ->setMessage($e->getMessage());
                return new JsonResponse(HJsonResponse::normalize($hResponse));
            }
        }

        if($confirm !== null){
            $hResponse->setStatus(HJsonResponse::CONFIRM)
                ->setMessage($confirm);
            return new JsonResponse(HJsonResponse::normalize($hResponse));
        }

        // else we delete the article
        $session->remove('processedConfirmation');
        try{
            $mapper->delete($article->getId());
            $hResponse->setMessage("L'article a été supprimé");
        }
        catch(\Exception $e){
            $hResponse->setStatus(HJsonResponse::ERROR)
                ->setMessage($e->getMessage());
            return new JsonResponse(HJsonResponse::normalize($hResponse));
        }
        return new JsonResponse(HJsonResponse::normalize($hResponse));
    }

    /**
     * @param Article $article
     * @param ArticleHelper $helper
     * @Route("/get-json/{article}",name="article_get_json",requirements={"page": "\d+"})
     * @ParamConverter("article", class="AppBundle:Article")
     * @Method({"GET"})
     * @return JsonResponse
     */
    public function getJsonAction(Article $article,ArticleHelper $helper)
    {
        var_dump($helper->serializeArticle($article));
        return new JsonResponse($article);
    }

    /**
     * @param Request $request
     * @param MediatorFactory $mediatorFactory
     * @param ArticleDTONormalizer $normalizer
     * @param JsonEncoder $encoder
     * @Route("/list",name="article_list")
     * @Method({"GET","POST"})
     * @throws \Exception
     * @return Response
     */
    public function listAction(Request $request,
                               MediatorFactory $mediatorFactory,
                               ArticleDTONormalizer $normalizer,
                               JsonEncoder $encoder)
    {
        $this->get('session')->remove('processedConfirmation');
        $form = $this
            ->get('form.factory')
            ->createBuilder(ArticleDTOType::class,null,[
                'validation_groups'=>['minimal','date','abstract']
            ])
            ->getForm();

        $searchForm = $this
            ->get('form.factory')
            ->createBuilder(ArticleSearchType::class,null,['validation_groups'=>[]])
            ->getForm();

        $groups = ['minimal','abstract','date','url'];
        $mediator = $mediatorFactory->create(ArticleDTOMediator::class);
        $articleDTO = $mediator
            ->mapDTOGroups($groups)
            ->getDTO();
        $groups = array_merge($groups,['groups','type']);

        $serializedArticleDTO = $encoder->encode($normalizer->normalize($articleDTO,$groups),'json');

        return $this->render('@AppBundle/Article/list.html.twig',[
            "form"=>$form->createView(),
            "searchForm"=>$searchForm->createView(),
            "newArticleDTO" =>$serializedArticleDTO
            ]
        );
    }

    /**
     *
     * @param Request $request
     * @param DTOFactory $dtoFactory
     * @param MediatorFactory $mediatorFactory
     * @param ArticleDTONormalizer $normalizer
     * @param UrlEncoder $urlEncoder
     * @param ArticleMapper $mapper
     * @Route("/get-list-data",name="article_getlistdata")
     * @Method({"GET","POST"})
     * @throws \Exception
     * @return JsonResponse
     */
    public function getListDataAction(Request $request,
                                      dtoFactory $dtoFactory,
                                      MediatorFactory $mediatorFactory,
                                      ArticleDTONormalizer $normalizer,
                                      UrlEncoder $urlEncoder,
                                      ArticleMapper $mapper)
    {
        $logger = $this->get('logger');

        $test = $urlEncoder->decode($request->getRequestUri());
        $logger->info(join(";",array_keys($test)));
        $logger->info(join(";",array_values($test)));
        $logger->info('I just got the logger2');

        if(array_key_exists("search",$test)){
            $searchForm = $this
                ->get('form.factory')
                ->createBuilder(ArticleSearchType::class,null,['validation_groups'=>[]])
                ->getForm();

            $searchForm->submit((array)json_decode($test["search"]));
            $test["search"] = $searchForm->getData();
        }

        $searchBag = SearchBag::createFromArray($test);
        //$logger->info($searchBag->getSearch()["beginHDate"]);
        $logger->info($searchBag);
        //$logger->info($searchForm->getData()["beginHDate"]->getLabel());
        $logger->info('I just got the logger3');


        $count = 0;


        $groups = ['minimal','date','url'];
        $logger->info(count($searchBag->getSearch()));
        $articles = $mapper->searchBy($searchBag,$count);
        $articleDtos = [];

        $mediator = $mediatorFactory->create(ArticleDTOMediator::class,null,null,DTOMediator::NOTHING_IF_NULL);
        foreach($articles as $article){
            $articleDtos[] =  $mediator
                ->setEntity($article)
                ->setDTO($dtoFactory->create(ArticleDTO::class))
                ->mapDTOGroups($groups)
                ->getDTO();
        }

        $groups = array_merge($groups,['groups','type']);
        return new JsonResponse(BootstrapListHelper::getNormalizedListData($articleDtos,$normalizer,$groups,$count));
    }

    /**
     * @param Request $request
     * @param Article $article
     * @param MediatorFactory $mediatorFactory
     * @param ArticleDTONormalizer $normalizer
     * @Route("/get-data/{article}",name="article_getdata")
     * @Method({"GET"})
     * @return JsonResponse
     */
    public function getDataAction(Request $request,
                                  Article $article,
                                  MediatorFactory $mediatorFactory,
                                  ArticleDTONormalizer $normalizer){

        $hResponse = new HJsonResponse();
        $groups = $request->get("groups",['minimal']);
        try{
            $mediator = $mediatorFactory->create(ArticleDTOMediator::class,$article);
            $articleDto = $mediator
                ->mapDTOGroups($groups)
                ->getDTO();
            $hResponse->setData($normalizer->normalize($articleDto,$groups));
        }
        catch(\Exception $e){
            $hResponse->setStatus(HJsonResponse::ERROR)->setMessage($e->getMessage());
        }
        return new JsonResponse(HJsonResponse::normalize($hResponse));
    }


}
