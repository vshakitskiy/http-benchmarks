package main

import (
	"fmt"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	gin.SetMode(gin.ReleaseMode)
	router := gin.New()

	router.GET("/", func(c *gin.Context) {
		c.Status(http.StatusOK)
	})

	router.GET("/user/:id", func(c *gin.Context) {
		id := c.Param("id")
		c.String(http.StatusOK, id)
	})

	router.POST("/user", func(c *gin.Context) {
		if c.Request.Body != nil {
			io.Copy(c.Writer, c.Request.Body)
		}
	})

	if err := router.Run(":8080"); err != nil {
		fmt.Printf("Failed to start server: %v", err)
	}
}
