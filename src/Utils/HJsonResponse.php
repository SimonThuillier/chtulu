<?php
/**
 * Created by PhpStorm.
 * User: ajeelomen-1
 * Date: 17/04/18
 * Time: 20:53
 */

namespace App\Utils;


use Symfony\Component\Validator\ConstraintViolationInterface;
use Symfony\Component\Validator\ConstraintViolationListInterface;

class HJsonResponse
{
    const SUCCESS="success";
    const INFO="info";
    const WARNING="warning";
    const ERROR="error";
    const CONFIRM="confirm";


    /** @var string */
    private $status;
    /** @var string|null */
    private $message;
    /** @var string|null */
    private $senderKey;
    /** @var mixed|null */
    private $data;
    /** @var mixed|null */
    private $errors;

    /**
     * HJsonResponse constructor.
     * @param string $status
     * @param null|string $message
     * @param null|string $senderKey
     */
    public function __construct(string $status=self::SUCCESS,
                                ?string $message='l\'action a bien été effectuée',
                                ?string $senderKey=null)
    {
        $this->status = $status;
        $this->message = $message;
        $this->senderKey = $senderKey;
    }

    /**
     * @return string
     */
    public function getStatus(): string
    {
        return $this->status;
    }

    /**
     * @param string $status
     * @return HJsonResponse
     */
    public function setStatus(string $status): HJsonResponse
    {
        $this->status = $status;
        return $this;
    }

    /**
     * @return null|string
     */
    public function getMessage(): ?string
    {
        return $this->message;
    }

    /**
     * @param null|string $message
     * @return HJsonResponse
     */
    public function setMessage(?string $message): HJsonResponse
    {
        $this->message = $message;
        return $this;
    }

    /**
     * @return null|string
     */
    public function getSenderKey(): ?string
    {
        return $this->senderKey;
    }

    /**
     * @param null|string $senderKey
     * @return HJsonResponse
     */
    public function setSenderKey(?string $senderKey): HJsonResponse
    {
        $this->senderKey = $senderKey;
        return $this;
    }

    /**
     * @return mixed|null
     */
    public function getData()
    {
        return $this->data;
    }

    /**
     * @param mixed|null $data
     * @return HJsonResponse
     */
    public function setData($data): HJsonResponse
    {
        $this->data = $data;
        return $this;
    }

    /**
     * @return mixed|null
     */
    public function getErrors()
    {
        return $this->errors;
    }

    /**
     * @param mixed|null $errors
     * @return HJsonResponse
     */
    public function setErrors($errors): HJsonResponse
    {
        $this->errors = $errors;
        return $this;
    }

    static public function normalize(self $hResponse){
        return [
            "status" => $hResponse->getStatus(),
            "message" => $hResponse->getMessage(),
            "senderKey" => $hResponse->getSenderKey(),
            "data" => $hResponse->getData(),
            "errors" =>$hResponse->getErrors()
        ];
    }

    /**
     * @param ConstraintViolationListInterface|array $errors
     * @return array
     */
    static public function normalizeFormErrors($errors){
        if(is_array($errors)) return $errors;
        $arrayErrors = [];
        if(count($errors) === 0) return $arrayErrors;
        /** @var ConstraintViolationInterface $error */
        foreach($errors as $error){
            if(array_key_exists($error->getPropertyPath(),$arrayErrors)){
                $arrayErrors[$error->getPropertyPath()] = [$error->getMessage()];
            }
            else{
                $arrayErrors[$error->getPropertyPath()][] = $error->getMessage();
            }
        }
        return $arrayErrors;
    }




}