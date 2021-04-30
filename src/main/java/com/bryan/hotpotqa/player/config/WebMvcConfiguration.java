package com.bryan.hotpotqa.player.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * @author shbu
 */
@Configuration
public class WebMvcConfiguration implements WebMvcConfigurer {
    public static final String WILDCARD_SUFFIX = "/**";

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/portal/").setViewName("forward:/portal/index.html");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/portal" + WILDCARD_SUFFIX)
                .addResourceLocations("classpath:/static/dist/");

    }

}
