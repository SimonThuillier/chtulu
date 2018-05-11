<?php
namespace AppBundle\Controller;

use AppBundle\DTO\ArticleDTO;
use AppBundle\Factory\ArticleFactory;
use AppBundle\Form\ArticleDTOType;
use AppBundle\Form\ArticleSearchType;
use AppBundle\Helper\BootstrapListHelper;
use AppBundle\Mapper\ArticleMapper;
use AppBundle\Mediator\ArticleDTOMediator;
use AppBundle\Serializer\ArticleDTOSerializer;
use AppBundle\Utils\HJsonResponse;
use Symfony\Bridge\Doctrine\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use AppBundle\Entity\Article;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Factory\ArticleDTOFactory;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Routing\Router;
use AppBundle\Helper\ArticleHelper;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use AppBundle\Processor\GenericProcessor;
use AppBundle\Listener\SearchArticleFormListener;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Validator\ValidatorBuilder;

/**
 *
 * @author belze
 *         @Route("/article")
 */
class ArticleController extends Controller
{
    /**
     * @Route("/create",name="article_create")
     * @Method({"GET"})
     */
    public function createAction(Request $request,
                                 ArticleDTOFactory $dtoFactory,
                                 ArticleFactory $entityFactory,
                                 ArticleDTOMediator $mediator)
    {
        $groups = ['minimal','abstract','date'];
        $mediator
            ->setEntity($entityFactory->create($this->getUser()))
            ->setDTO($dtoFactory->create($this->getUser()))
            ->mapDTOGroups($groups);
        $form = $this
            ->get('form.factory')
            ->createBuilder($mediator->getFormTypeClassName(),$mediator->getDTO(),[
                'validation_groups'=>$groups])
            ->add('save',SubmitType::class)
            ->setAction($this->generateUrl("article_post_create"))
            ->getForm();

        return $this->render('@AppBundle/Article/create.html.twig',array(
            'form' => $form->createView(),
            'modalForm' => $form->createView(),
            'beginDate' => (new \DateTime())->sub(new \DateInterval('P30D')),
            'endDate' =>(new \DateTime())
        ));
    }

    /**
     * @Route("/post-create",name="article_post_create")
     * @Method({"POST","GET"})
     */
    public function postCreateAction(Request $request,
                                 ArticleDTOFactory $dtoFactory,
                                 ArticleFactory $entityFactory,
                                 ArticleDTOMediator $mediator,
                                 ArticleMapper $mapper,
                                     Router $router,
                                     ArticleDTOSerializer $serializer)
    {
        $hResponse = new HJsonResponse();
        $groups = $request->get("groups",['minimal']);
        $errors=[];
        $groups=['minimal','date','abstract'];
        $data = null;
        try{
            $mediator
                ->setEntity($entityFactory->create($this->getUser()))
                ->setDTO($dtoFactory->create($this->getUser()))
                ->setRouter($router)
                ->mapDTOGroups($groups);
            $form = $this
                ->get('form.factory')
                ->createBuilder($mediator->getFormTypeClassName(),$mediator->getDTO(),[
                    'validation_groups'=>$groups])
                ->add('save',SubmitType::class)
                ->getForm();

            $mediator
                ->resetChangedProperties()
                ->setMapper($mapper);
            $form->submit($request->request->get("form"));
            $errors = $this->get('validator')->validate($mediator->getDTO());
            if (! $form->isValid() || count($errors)>0)
            {
                throw new \Exception("Le formulaire contient des erreurs à corriger avant creation");
            }
            $mapper->add();
            $mediator->mapDTOGroup('url');
            $hResponse
                ->setMessage("L'article a été creé")
                ->setData($serializer->normalize($mediator->getDTO(),['url']));
        }
        catch(\Exception $e){
            $hResponse->setStatus(HJsonResponse::ERROR)
                ->setMessage($e->getMessage())
                ->setErrors(HJsonResponse::normalizeFormErrors($errors));
        }
        return new JsonResponse(HJsonResponse::normalize($hResponse));
    }

    /**
     * @Route("/edit/{article}",name="article_edit")
     * @ParamConverter("article", class="AppBundle:Article")
     * @Method({"GET"})
     */
    public function editAction(Request $request,
                               Article $article,
                                 ArticleDTOFactory $dtoFactory,
                                 ArticleDTOMediator $mediator,
                                Router $router)
    {
        $groups = ['minimal','abstract','date'];
        $mediator
            ->setEntity($article)
            ->setDTO($dtoFactory->create($this->getUser()))
            ->mapDTOGroups($groups);
        $form = $this
            ->get('form.factory')
            ->createBuilder($mediator->getFormTypeClassName(),$mediator->getDTO(),[
                'validation_groups'=>$groups])
            ->add('save',SubmitType::class)
            ->setAction($this->generateUrl("post_article_edit",["article"=>$article->getId()]))
            ->getForm();
        /** @var ArticleDTO $articleDto */
        $articleDto = $mediator->getDTO();


        return $this->render('@AppBundle/Article/create.html.twig',array(
            'form' => $form->createView(),
            'articleDto' => $articleDto,
            'modalForm' => $form->createView(),
            'beginDate' => (new \DateTime())->sub(new \DateInterval('P30D')),
            'endDate' =>(new \DateTime())
        ));
    }

    /**
     * @Route("/post-edit/{article}",name="article_post_edit")
     * @ParamConverter("article", class="AppBundle:Article")
     * @Method({"POST"})
     */
    public function postEditAction(Request $request,
                                   Article $article,
                                     ArticleDTOFactory $dtoFactory,
                                     ArticleDTOMediator $mediator,
                                     ArticleMapper $mapper)
    {
        $hResponse = new HJsonResponse();
        $groups = $request->get("groups",['minimal']);
        $errors=[];
        $groups=['minimal','date','abstract'];
        try{
            $mediator
                ->setEntity($article)
                ->setDTO($dtoFactory->create($this->getUser()))
                ->mapDTOGroups($groups);
            $form = $this
                ->get('form.factory')
                ->createBuilder($mediator->getFormTypeClassName(),$mediator->getDTO(),[
                    'validation_groups'=>$groups])
                ->add('save',SubmitType::class)
                ->getForm();

            $mediator
                ->resetChangedProperties()
                ->setMapper($mapper);
            $form->submit($request->request->get("form"));
            $errors = $this->get('validator')->validate($mediator->getDTO());
            if (! $form->isValid() || count($errors)>0)
            {
                throw new \Exception("Le formulaire contient des erreurs à corriger avant validation");
            }
            $mapper->edit();
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
     * @Route("/cancel/{article}",name="article_cancel")
     * @ParamConverter("article", class="AppBundle:Article")
     * @Method({"POST"})
     */
    public function cancelAction(Request $request,
                                 Article $article)
    {
        $this->get('session')->remove('processedConfirmation');
        return new Response("OK");
    }


    /**
     * @Route("/delete/{article}",name="article_delete")
     * @ParamConverter("article", class="AppBundle:Article")
     * @Method({"GET","POST"})
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
     * @Route("/get-json/{article}",name="article_get_json",requirements={"page": "\d+"})
     * @ParamConverter("article", class="AppBundle:Article")
     * @Method({"GET"})
     */
    public function getJsonAction(Article $article,ArticleHelper $helper)
    {
        var_dump($helper->serializeArticle($article));
        return new JsonResponse($article);
    }

    /**
     * @Route("/list",name="article_list")
     * @Method({"GET","POST"})
     */
    public function listAction(Request $request,
                               GenericProcessor $processor,
                               SearchArticleFormListener $listener,
                               ArticleDTOFactory $dtoFactory,
                               ArticleFactory $entityFactory,
                               ArticleDTOMediator $mediator,
                               ArticleDTOSerializer $serializer,
                               Router $router)
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
            ->createBuilder(ArticleSearchType::class,null,[
                'validation_groups'=>['minimal','date','abstract']
            ])
            ->getForm();

        $article=$entityFactory->create($this->getUser());
        $groups = ['minimal','abstract','date','url'];
        $articleDTO = $mediator
            ->setEntity($article)
            ->setDTO($dtoFactory->create($this->getUser()))
            ->setRouter($router)
            ->mapDTOGroups($groups)
            ->getDTO();
        $groups = array_merge($groups,['groups','type']);
        $serializedArticleDTO = $serializer->encode($serializer->normalize($articleDTO,$groups));


        return $this->render('@AppBundle/Article/list.html.twig',[
            "form"=>$form->createView(),
            "searchForm"=>$searchForm->createView(),
            "newArticleDTO" =>$serializedArticleDTO
            ]
        );





//        /** @var Session $session */
//        $session = $this->get('session');
//
//        if($request->getMethod() === 'GET' && $session->has('articleListResponse')){
//            $page = $session->get('articleListResponse');
//            $session->remove('articleListResponse');
//            return new Response($page);
//        }
//        else if($request->getMethod() === 'POST'){
//            $result = $processor->addSubscriber($listener)->process($request);
//            $session->set('articleListResponse',$this->get('templating')->render('@AppBundle/Article/list.html.twig',$result));
//            return new JsonResponse(['success'=>true]);
//        }
//        // default GET behaviour
//        /** @var Event $result */
//        $result = $processor->addSubscriber($listener)->process($request);
//        return $this->render('@AppBundle/Article/list.html.twig',$result);
    }

    /**
     * @Route("/get-list-data",name="article_getlistdata")
     * @Method({"GET","POST"})
     */
    public function getListDataAction(Request $request,
                                      ManagerRegistry $doctrine,
                                      ArticleDTOFactory $dtoFactory,
                                      ArticleDTOMediator $mediator,
                                      ArticleDTOSerializer $serializer,
                                      Router $router)
    {
        $groups = ['minimal','date','url'];
        $articles = $doctrine->getRepository(Article::class)->findAll();
        $articleDtos = [];

        foreach($articles as $article){
            $articleDtos[] =  $mediator
                ->setEntity($article)
                ->setDTO($dtoFactory->create($this->getUser()))
                ->setRouter($router)
                ->mapDTOGroups($groups)
                ->getDTO();
        }

        $groups = array_merge($groups,['groups','type']);
        return new JsonResponse(BootstrapListHelper::getNormalizedListData($articleDtos,$serializer,$groups));
    }

    /**
     * @Route("/view/{article}",name="article_view")
     * @Method({"GET"})
     *
     */
    public function viewAction(Article $article){
        return new JsonResponse(["test" => "lol"]);
    }



    /**
     * @Route("/get-data/{article}",name="article_getdata")
     * @Method({"GET"})
     *
     */
    public function getDataAction(Request $request,Article $article,  ArticleDTOFactory $dtoFactory,
                                  ArticleDTOMediator $mediator,ArticleDTOSerializer $serializer){

        $hResponse = new HJsonResponse();
        $groups = $request->get("groups",['minimal']);
        try{
            $articleDto = $mediator
                ->setEntity($article)
                ->setDTO($dtoFactory->create($this->getUser()))
                ->mapDTOGroups($groups)
                ->getDTO();
            $hResponse->setData($serializer->normalize($articleDto,$groups));
        }
        catch(\Exception $e){
            $hResponse->setStatus(HJsonResponse::ERROR)->setMessage($e->getMessage());
        }
        return new JsonResponse(HJsonResponse::normalize($hResponse));
    }


}
