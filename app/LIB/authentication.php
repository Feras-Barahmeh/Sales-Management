<?php

namespace APP\LIB;

use function APP\pr;

class Authentication
{
    private static $_instance;
    private array $_authorizedURLs = [
        "/index/default",
        "/language/default",
        "/authentication/logout",
        "/denyauthorizeaccess/default",
        "/notfound/notfound",
    ];
    private $_session;
    private function __construct($_session)
    {
        $this->_session = $_session;
    }
    public function __clone(){}

    public static function getInstance($session): Authentication
    {
        if (self::$_instance === null) {
            self::$_instance = new self($session);
        }
        return self::$_instance;
    }

    public function isAuthenticated(): bool
    {
        return isset($this->_session->user);
    }

    public function authorizedAccess($controller, $action): bool
    {
        $url = '/' . $controller . '/' . $action;
        if (in_array($url, $this->_authorizedURLs) || in_array($url, $this->_session->user->privileges)) {
            return true;
        }
        return false;
    }
}