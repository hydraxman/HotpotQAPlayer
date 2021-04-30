package com.bryan.hotpotqa.player.config;

import com.bryan.hotpotqa.player.service.ResultDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class ContextSetup implements ApplicationRunner {
    @Autowired
    ResultDataService resultDataService;
    @Override
    public void run(ApplicationArguments args) throws Exception {
        resultDataService.initialize();
    }
}
