#version 330

out vec4 fragColor;
uniform float inputTime;
void main() 
{
    vec4 finalColor = vec4(1);

    // Insert your code for "Slightly-More Advanced Shaders" here.
 		finalColor.x = finalColor.x - sin(inputTime);
    finalColor.y = finalColor.y;
    finalColor.z = finalColor.z;
    fragColor = finalColor;
}
