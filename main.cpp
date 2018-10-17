#include "common/MediaLayer.h"
#include "common/Rendering/ForwardRenderer.h"
#include "FreeImage.h"

#include "assignment1/Assignment1.h"
#include "assignment2/Assignment2.h"
#include "assignment3/Assignment3.h"
#include "assignment4/Assignment4.h"
#include "assignment5/Assignment5.h"

// Change this line to switch between the assignments
// #define APPLICATION Assignment1
// For example:
// #define APPLICATION Assignment2
// #define APPLICATION Assignment3
#define APPLICATION Assignment4
// #define APPLICATION Assignment5

#include <iostream>
#include <chrono>

int main(int argc, char** argv) {
    FreeImage_Initialise();

    std::unique_ptr<Application> app = APPLICATION::CreateApplication(APPLICATION::CreateScene(), APPLICATION::CreateCamera());
    if (!app) {
        std::cerr << "ERROR: Created application is not valid." << std::endl;
        return 1;
    }

    // The renderer depends on the camera and the scene generated by the application.
    // Make sure those are initialized first before continuing.
    std::unique_ptr<Renderer> renderer = app->CreateRenderer();
    if (!renderer) {
        std::cerr << "ERROR: Created renderer is not valid." << std::endl;
        return 1;
    }

    MediaLayer media(std::move(app), std::move(renderer));

    // NOTE: 'app' is no longer a valid pointer here. Make sure you do any initialization for your Application before
    // the MediaLayer is constructed.

    auto lastTickTime = std::chrono::high_resolution_clock::now();
    auto startTickTime = lastTickTime;
    while (media.CanTick()) {
        auto currentTickTime = std::chrono::high_resolution_clock::now();
        auto deltaTime = std::chrono::duration_cast<std::chrono::duration<double>>(currentTickTime - lastTickTime);
        auto totalElapsedTime = std::chrono::duration_cast<std::chrono::duration<double>>(currentTickTime - startTickTime);
        media.Tick(deltaTime.count(), totalElapsedTime.count());
        lastTickTime = currentTickTime;
    }

    FreeImage_DeInitialise();
    return 0;
}
