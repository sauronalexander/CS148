#version 330

out vec4 fragColor;
uniform float inputTime;

void main() 
{
    vec4 finalColor = vec4(1);

    // Insert your code for "Slightly-More Advanced Shaders" here.
    finalColor.x = finalColor.x - sin(0.5*inputTime);
    finalColor.y = finalColor.y - sin(1*inputTime);
    finalColor.z = finalColor.z - sin(1.5*inputTime);
    fragColor = finalColor;
}
