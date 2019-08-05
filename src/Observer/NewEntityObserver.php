<?php
/**
 * Created by PhpStorm.
 * User: simon
 * Date: 05/08/19
 * Time: 21:53
 */

namespace App\Observer;


use App\Mediator\DTOMediator;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class NewEntityObserver
{
    private $user;

    private $entities = [];
    private $requests = [];

    public function __construct(TokenStorageInterface $tokenStorage)
    {
        $this->user = $tokenStorage->getToken()->getUser();
    }

    public function notifyNewEntity($entityClassName,$id,$entity,$priority){

        $this->entities[$entityClassName . ':' . $id] = ['entity'=>$entity,'priority'=>$priority];

        if(array_key_exists($entityClassName . ':' . $id,$this->requests)){
            foreach($this->requests[$entityClassName . ':' . $id] as $request){
                $this->setEntity($entityClassName,$id,$request['mediator'],$request['entity'],$request['setterName']);
            }
        }
    }

    public function askNewEntity($entityClassName,$id,$mediator,$entity,$setterName){

        if(array_key_exists($entityClassName . ':' . $id,$this->entities)){
            $this->setEntity($entityClassName,$id,$mediator,$entity,$setterName);
        }
        else{
            if(!array_key_exists($entityClassName . ':' . $id,$this->requests)){
                $this->requests[$entityClassName . ':' . $id] = [];
            }
            $this->requests[$entityClassName . ':' . $id][] = [
                'mediator'=>$mediator,
                'entity'=>$entity,
                'setterName'=>$setterName
            ];
        }
    }

    /**
     * @param $entityClassName
     * @param $id
     * @param DTOMediator $mediator
     * @param $entity
     * @param $setterName
     * @return self
     */
    private function setEntity($entityClassName,$id,$mediator,$entity,$setterName){
        $subEntity = $this->entities[$entityClassName . ':' . $id]['entity'];
        $priority = $this->entities[$entityClassName . ':' . $id]['priority'];
        $entity->$setterName($subEntity);
        $mediator->setEntityPriority($priority-1);

        return $this;
    }


}